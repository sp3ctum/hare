export function loadJs(url) {
  var script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
  console.log(`Loaded file ${url}"`);
}

export function loadCss(src) {
  return new Promise(function (resolve, reject) {
    let link = document.createElement("link");
    link.href = src;
    link.rel = "stylesheet";
    link.id = "sakura-customizations-css";

    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`Style load error for ${src}`));

    document.head.append(link);
    console.log(`Loaded file ${src}"`);
  });
}

export const base = "https://sp3ctum.github.io/sakura-paris-customizations";