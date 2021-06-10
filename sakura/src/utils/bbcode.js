import { initial, last } from "lodash";
import * as p from "parjs";
import {
  backtrack,
  later,
  many,
  manySepBy,
  manyTill,
  map,
  or,
  qthen,
  stringify,
  then,
} from "parjs/combinators";

export function tokenize(inputText) {
  try {
    const parseResult = text.parse(inputText);
    return parseResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// helper
const joinSuccessiveStringTokens = (tokens) => {
  // join successive string tokens ("a","b" = "ab")
  return tokens.reduce((result, token) => {
    const previousToken = last(result);
    if (typeof token === "string" && typeof previousToken === "string") {
      const beforePrevious = initial(result);
      const newToken = previousToken + token;
      return [...beforePrevious, newToken];
    } else {
      return [...result, token];
    }
  }, []);
};

//
// tag parsers

const nestableTag = later();
const bbcodeTag = later();
const contentToken = bbcodeTag.pipe(or(p.anyChar()));

// Helper for constructing simple conversions.
//
// A tag is defined as
// - a start tag
// - tag contentToken (text or another tag)
// - a closing tag
const parseTag = (tagName) => {
  const startingTag = p.string(`[${tagName}]`); //
  const closingTag = p.string(`[/${tagName}]`);

  return startingTag.pipe(
    qthen(
      contentToken.pipe(
        //
        manyTill(closingTag),
        map((content) => {
          const joinedContent = joinSuccessiveStringTokens(content);
          return {
            type: tagName,
            content: joinedContent,
          };
        })
      )
    )
  );
};

// requires "lazy" initialization due to recursion
nestableTag.init(
  parseTag("keyword").pipe(
    or(
      parseTag("subscript"),
      parseTag("superscript"),
      parseTag("decoration"),
      parseTag("emphasis")
    )
  )
);

// more complex tags
const reference = () => {
  const startingTag = p.string("[reference]");
  const numbers = p.digit().pipe(many(), stringify());
  const page = p.string("page=").pipe(qthen(numbers));
  const offset = p.string("offset=").pipe(qthen(numbers));

  const closingTag = p.string("[/reference ").pipe(
    then(page, p.string(","), offset, p.string("]")),
    map((things) => {
      const [_closeStart, pageNo, _comma, offsetNo] = things;
      return { page: pageNo, offset: offsetNo };
    })
  );

  return startingTag.pipe(
    qthen(
      contentToken.pipe(
        manyTill(closingTag.pipe(backtrack())),
        map((tokens) => {
          return joinSuccessiveStringTokens(tokens);
        }),
        then(closingTag),
        map((things) => {
          const [contents, endTagProperties] = things;
          return { type: "reference", content: contents, ...endTagProperties };
        })
      )
    )
  );
};

// parses "page=123"
export const propertyKeyValue = p.noCharOf("=,]").pipe(
  many(),
  stringify(),
  manySepBy("=", 2),
  map((things) => {
    const [key, value] = things;
    return { [key]: value };
  })
);

// parses "page=123,offset=456,foo=bar"
export const propertyKeyValueListing = propertyKeyValue.pipe(
  manySepBy(","),
  map((things) => {
    const result = things.reduce((result, current) => {
      return { ...result, ...current };
    }, {});
    return result;
  })
);

const image = () => {
  const startingTagStart = p.string("[image ");
  const startingTagEnd = p.string("]");

  const alt = p.noCharOf("[]").pipe(many(), stringify());

  const closingTag = p.string("[/image]");

  return startingTagStart.pipe(
    then(
      //
      propertyKeyValueListing,
      startingTagEnd,
      alt,
      closingTag
    ),
    map((things) => {
      const [_start, properties, _startEnd, alt] = things;
      // content does not allow any tags whatsoever
      return { type: "image", content: [alt], ...properties };
    })
  );
};

bbcodeTag.init(
  nestableTag.pipe(
    or(
      // these tags are complex and they also cannot be nested
      reference(),
      image()
    )
  )
);

const text = bbcodeTag
  .pipe(or(p.anyChar())) //
  .pipe(
    many(),
    map((tokens) => {
      return joinSuccessiveStringTokens(tokens);
    })
  );

//     p.string("mono"),
//     p.string("wav"),
