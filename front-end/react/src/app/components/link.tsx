import { Avatar, Button } from '@material-ui/core';
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export type LinkProp = {
    url: string;
    thumbUrl: string;
    label: string;
};

export type LinkCollectionProp = {
    links: LinkProp[];
    width: string;
    height: string;
};

const styles = makeStyles({
    root: {
        color: 'black',
        backgroundColor: '#F9F7F6',
        textTransform: 'none',
    },
});

export const Link = (l: LinkProp) => {
    let classes = styles();
    let { url, thumbUrl, label } = l;
    const onClick = () => {
        window.location.href = url;
    };
    return (
        <div style={{ width: '100%', marginBottom: '20px' }}>
            <Button
                variant="contained"
                disableElevation={true}
                className={classes.root}
                startIcon={
                    <Avatar
                        variant="square"
                        src={thumbUrl}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '0px',
                            boxShadow: 'none',
                            color: 'white',
                        }}
                    />
                }
                endIcon={<div></div>}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: 'none',
                }}
            >
                {label}
            </Button>
        </div>
    );
};

export const LinkCollection = (l: LinkCollectionProp) => {
    let { height, links, width } = l;
    return (
        <div style={{ width, height }}>
            {links.map(linkProp => Link(linkProp))}
        </div>
    );
};
