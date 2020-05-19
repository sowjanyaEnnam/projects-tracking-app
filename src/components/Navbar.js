import React from 'react';

function Navbar() {
    return (
        <nav>
            <div className="nav-wrapper teal">
                <ul id="nav-mobile" className="left" style={{ paddingLeft: '2rem' }}>
                    <li style={{ lineHeight: '3px' }}>
                        <p className='white-text text-darken-10'
                            style={{
                                margin: '20px 0px 7px 0px',
                                fontSize: '12px'
                            }}
                        >Projects / ENV1.5</p>
                        <h5 style={{ margin: '0px' }}>
                            Releases
                        </h5>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;