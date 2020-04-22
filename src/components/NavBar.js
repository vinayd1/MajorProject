import React from 'react'

const NavBar = ({ name, account }) => <nav className="navbar navbar-dark fixed-top bg-dark d-block p-0 shadow">
    <div className="d-flex flex-wrap justify-content-between align-items-center px-2 pt-1 pb-2">
        <p className="text-white mr-0 mb-0 h2">{name}</p>
        <p className="text-white mr-3 mb-0">{account}</p>
    </div>
</nav>

export default NavBar;
