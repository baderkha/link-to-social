import React, { useState } from "react";
import SearchBar from "../../components/Searchbar";
import { isSubstring } from "../../util/subString";
import { SelenaDummyLinks } from '../Page/selena_test';
import { Card, CardActionArea, CardActions, CardMedia, CardContent, Typography, Button, Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


export type ExploreProps = {

}

const useStyles = makeStyles<Theme, ExploreProps>((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        cardRoot: {
            maxWidth: 345,
          },
          media: {
            height: 140,
            backgroundPosition: 'top'
          },
    }),
);

export const Explore = (props: ExploreProps) => {
    const {} = props;
    let classes = useStyles(props)

    const [searchQuery, setSearchQuery] = useState("")

    const filteredExplore = SelenaDummyLinks.links.filter(
        data => 
        isSubstring(data.label || '', searchQuery) ||
        isSubstring(data.thumbUrl || '', searchQuery) ||
        isSubstring(data.url || '', searchQuery)
    )
    return (
        <div className={classes.root}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <div style={{width: "100%"}}>
            <Grid container spacing={4} >
                {filteredExplore.map((el) => {
                return (
                    <Grid item xs={4} style={{display:"flex",justifyContent:"center"}}>
                        <Card className={classes.cardRoot}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image={el.thumbUrl}
                                    title="Selena is Bae"
                                    />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {el.label}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary">
                                Use Theme
                                </Button>
                                <Button size="small" color="primary">
                                Learn More
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )  
                })}
                </Grid>
            </div>
        </div>
    )
}