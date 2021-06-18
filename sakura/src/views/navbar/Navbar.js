import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link } from "react-router-dom";

const Navbar = ({ children }) => {
  return (
    <div className="mt-3 d-flex">
      <div className="col pl-1">{children}</div>
      <DropdownButton
        as={ButtonGroup}
        id="nav-menu"
        variant="secondary"
        title={<i className="bi bi-list"></i>}
      >
        <Dropdown.Item as={Link} to="/">
          Dictionary
        </Dropdown.Item>
        <Dropdown.Item as={Link} to={"/grammar"}>
          Grammar
        </Dropdown.Item>
        <Dropdown.Item as={Link} to={"/settings"}>
          Settings
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

export default Navbar;
