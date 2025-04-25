import React from 'react';
import { Wallet, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">
                AllInWeb3
              </span>
            </div>
            <p className="mt-4 text-gray-400">
              Your trusted companion in the Web3 journey
            </p>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold">Learn</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">Tools</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Wallet Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  DApp Directory
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">Community</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Events
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © Since 2021 AllInWeb3. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm text-center"><a href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2022010084号-1</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;