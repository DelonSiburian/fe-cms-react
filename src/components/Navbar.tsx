import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";  

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}


const Navbar = () => {  
  const { logout } = useAuth();  
  const navigate = useNavigate();  
  
  const handleHomeClick = () => {  
    navigate('/');  
  };  
  const handleProfileClick = () => {  
    navigate('/profile');  
  };  
  return (  
    <Disclosure as="nav" className="bg-yellow-300 border-b-8 border-black font-mono">  
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">  
        <div className="relative flex h-20 items-center justify-between p-2">  
          <div onClick={handleHomeClick} 
           className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start gap-6">  
            <div className="flex shrink-0 items-center p-1">  
              <img  
                alt="Your Company"  
                src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"  
                className="h-10 w-auto"  
              />  
            </div>  
          </div>  
          <div className="flex items-center space-x-6 p-2">  
            {/* Profile dropdown */}  
            <Menu as="div" className="relative">  
              <div>  
                <MenuButton className="flex rounded-none bg-yellow-300 border-4 border-black focus:outline-none focus:ring-4 focus:ring-black">  
                  <span className="sr-only">Open user menu</span>  
                  <img  
                    alt=""  
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"  
                    className="h-10 w-10 border-4 border-black rounded-none"  
                  />  
                </MenuButton>  
              </div>  
              <MenuItems  
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-none bg-yellow-300 border-4 border-black py-1 font-extrabold text-black shadow-none"  
              >  
                <MenuItem>  
                  {({ active }) => (  
                    <button  
                      onClick={handleProfileClick} 
                      className={`${  
                        active ? "bg-black text-yellow-300" : "text-black"  
                      } block w-full px-4 py-2 text-left border-b-4 border-black`}  
                    >  
                      Your Profile  
                    </button>  
                  )}  
                </MenuItem>  
                <MenuItem>  
                  {({ active }) => (  
                    <button  
                      onClick={() => navigate("/manage-content")}  
                      className={`${  
                        active ? "bg-black text-yellow-300" : "text-black"  
                      } block w-full px-4 py-2 text-left border-b-4 border-black`}  
                    >  
                      Manage Content  
                    </button>  
                  )}  
                </MenuItem>  
                <MenuItem>  
                  {({ active }) => (  
                    <button  
                      onClick={() => logout()}  
                      className={`${  
                        active ? "bg-black text-yellow-300" : "text-black"  
                      } block w-full px-4 py-2 text-left border-b-4 border-black`}  
                    >  
                      Sign out  
                    </button>  
                  )}  
                </MenuItem>  
              </MenuItems>  
            </Menu>  
          </div>  
        </div>  
      </div>  
    </Disclosure>  
  );  
};  

export default Navbar;
