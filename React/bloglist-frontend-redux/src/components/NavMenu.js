import { Link } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';

const NavMenu = ({ handleLogout, user }) => {
  return (
    <Navbar bg="light" className="mb-4">
      <Container>
        <Navbar.Brand href="/" className="text-primary fs-4">
          Blog app
        </Navbar.Brand>
        <Link className="text-dark fs-4" to="/">
          Blogs
        </Link>
        <Link className="text-dark fs-4" to="/users">
          Users
        </Link>
        <div>
          {user && (
            <div className="text-dark fs-6">
              {user.name} logged in
              <Button
                onClick={handleLogout}
                variant="secondary"
                size="sm"
                className="ms-1"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
