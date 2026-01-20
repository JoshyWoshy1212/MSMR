// src/components/Sidebar.jsx
import './Sidebar.css'

const menuItems = [
  { id: 'inbox', icon: 'inbox', label: '받은편지함', active: true },
  { id: 'starred', icon: 'star_border', label: '별표편지함', active: false },
  { id: 'sent', icon: 'access_time', label: '보낸편지함', active: false },
  { id: 'drafts', icon: 'description', label: '임시보관함', active: false },
];

export default function Sidebar({ isSidebarClosed, activeMenu, onMenuClick, onComposeClick }) {
  return (
    <nav className={`sidebar ${isSidebarClosed ? 'sidebar-closed' : ''}`}>
      <button className="compose-btn" onClick={onComposeClick}>
        <span className="material-icons">edit</span>
        {!isSidebarClosed && <span>편지쓰기</span>}
      </button>
      <ul className="menu-list">
        {menuItems.map((item) => (
            <li 
                key={item.id} 
                className={activeMenu === item.id ? 'active' : ''}
                onClick={() => onMenuClick(item.id)}
            >
                <span className="material-icons">
                    {item.icon}
                </span>
                {!isSidebarClosed && <span>{item.label}</span>}
            </li>
        ))}
      </ul>
    </nav>
  );
}