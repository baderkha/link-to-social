import { TextField, Icon } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';

interface ISearchBarProps {
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
    useBottomMargin?: boolean;
    useTopMargin?: boolean;
    label?: string;
    minimal?: boolean;
}

const useStyles = makeStyles<Theme, ISearchBarProps>((theme) =>
    createStyles({
        root:{
            color: "black",
            backgroundColor:"#F9F7F6",
            textTransform:"none",
            '&:hover': {
                backgroundColor: '#eae4e4',
            },
        },
        input: {
            width: '100%',
            margin: 0,
            marginBottom: useBottomMargin => useBottomMargin ? '1rem' : 0,
            marginTop: useTopMargin => useTopMargin ? '1rem' : 0,
        },
        icon: {
            paddingRight: '0.5rem',
            paddingBottom: '0.3rem',
        },
    }),
);

const SearchBar = (props: ISearchBarProps) => {
    const { searchQuery, setSearchQuery, useBottomMargin: marginBottom, useTopMargin: marginTop, label, minimal } = props;

    let classes = useStyles(props)

    return (
        <TextField
            onChange={event => setSearchQuery(event.target.value)}
            value={searchQuery}
            className={classes.input}
            variant={minimal ? 'standard' : 'outlined'}
            size="small"
            placeholder={label || 'Search'}
            InputProps={{
                startAdornment: <Icon><SearchIcon className={classes.icon} /></Icon>,
                endAdornment:
                    searchQuery !== '' ? (
                        <IconButton
                            className="SearchBar__clearSearchQuery"
                            aria-label="clear search query"
                            size="small"
                            onClick={setSearchQuery.bind({}, '')}
                        >
                            <ClearIcon />
                        </IconButton>
                    ) : undefined,
            }}
        />
    );
};

export default SearchBar;
