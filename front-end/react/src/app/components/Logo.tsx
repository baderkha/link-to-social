import React from 'react';

const sizes = {
    small: '128',
    large: '256',
    full: '',
};

export const Logo = ({ size, white_color = false }) => {
    const clickHandler = () => {
        alert('clicked');
    };

    const src = !white_color ? '/logo.png' : '/logo_inverted_col.png';

    return <img src={src} width={sizes[size]} onClick={clickHandler}></img>;
};
