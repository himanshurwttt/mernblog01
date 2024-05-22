import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import {
  BsInstagram,
  BsFacebook,
  BsDribbble,
  BsGithub,
  BsTwitter,
} from "react-icons/bs";
const FooterComponent = () => {
  return (
    <Footer container className="border-t-8 border-teal-500">
      <div className=" w-full max-w-full">
        <div className="grid grid-cols-2 justify-between">
          <div className=" my-auto h-full">
            <Link
              to={"/"}
              className="font-bold text-xl sm:text-2xl dark:text-white"
            >
              <span className=" bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-white px-2 py-1  rounded-md">
                HR's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <Footer.Title title="ABOUT" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">100 js projects</Footer.Link>
                <Footer.Link href="#">Himanshu's Blog</Footer.Link>
                <Footer.Link href="#">100 js projects</Footer.Link>
                <Footer.Link href="#">Himanshu's Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="FOLLOW US" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">github</Footer.Link>
                <Footer.Link href="#">discoard</Footer.Link>
                <Footer.Link href="#">github</Footer.Link>
                <Footer.Link href="#">discoard</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link>Privacy policy</Footer.Link>
                <Footer.Link>Terms and Conditions</Footer.Link>
                <Footer.Link>Privacy policy</Footer.Link>
                <Footer.Link>Terms and Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:justify-between sm:items-center">
          <Footer.Copyright
            href="#"
            by="Himanshu's blog"
            year={new Date().getFullYear()}
          />
          <div className="flex sm:mt-0 mt-4 sm:justify-center gap-6">
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
