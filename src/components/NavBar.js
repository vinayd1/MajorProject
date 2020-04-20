import React from 'react'

const NavBar = ({name, account}) => <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
    <p className="navbar-brand col-sm-3 col-md-2 mr-0 mb-0">{name}</p>
    <p className="text-white mr-3 mb-0">{account}</p>
</nav>

export default NavBar;
