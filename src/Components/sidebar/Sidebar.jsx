const NavItem = ({ icon: Icon, label, isOpen }) => (
    <div className="flex items-center p-3 cursor-pointer hover:bg-slate-800 rounded-lg transition-colors group">
      <Icon size={24} className="text-slate-300 group-hover:text-blue-400 min-w-6" />
      {/* 
        Tailwind Improvement: 
        We use overflow-hidden and a fixed width on the label span 
        so it slides out smoothly rather than just appearing.
      */}
      <span className={`ml-4 text-slate-100 whitespace-nowrap transition-all duration-300 ${
        isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
      }`}>
        {label}
      </span>
    </div>
  );


export default NavItem