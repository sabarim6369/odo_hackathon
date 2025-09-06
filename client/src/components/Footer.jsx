const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">EcoFinds</span>
            </div>
            <p className="text-gray-300">
              A sustainable second-hand marketplace promoting circular economy through 
              quality pre-owned items.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-green-400 transition-colors">Browse Products</a></li>
              <li><a href="/about" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-green-400 transition-colors">Contact</a></li>
              <li><a href="/help" className="hover:text-green-400 transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <p className="text-gray-300 mb-4">
              Stay updated with the latest sustainable finds and eco-friendly tips.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; 2025 EcoFinds. All rights reserved. Built for sustainability.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
