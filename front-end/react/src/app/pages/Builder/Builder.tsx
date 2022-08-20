import * as React from 'react';
import { useInterval } from 'usehooks-ts'
import { Avatar, Typography, Divider, Button, Container, Card, CardContent, CardActions, ButtonGroup, CardHeader, CircularProgress, TextField, IconButton, Fade } from '@material-ui/core';
import { Add, ImageOutlined, Visibility, DeleteForever, Save, Image } from "@material-ui/icons"
import { LinkProp } from 'app/components/link';
import { LinkCollection } from 'app/components/link';
import { Logo } from 'app/components/Logo';
import { ShareButton } from 'app/components/ShareButton';
import Page, { PageOutBoundEvent, PagePropEvent, TypePageCloseEvent, TypePageProps } from '../Page/page';
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import { PageProps } from '../Page/page';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import SanityMobilePreview from 'sanity-mobile-preview'
import 'sanity-mobile-preview/dist/index.css?raw'
import { SelenaDummyLinks } from '../Page/selena_test';
import Frame from 'react-frame-component';
import { Link } from 'react-router-dom';
import { useEffect } from 'react-transition-group/node_modules/@types/react';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { EmptyLinks } from '../Page/blank_page';
import { isMoible } from 'app/util/mobile';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow'
import SpeedDialTooltipOpen from 'app/components/SpeedDialBuilder';
import CloseIcon from '@material-ui/icons/Close'
import Box from '@material-ui/core/Box';



import Modal from '@material-ui/core/Modal';
import LoadingIframe from 'app/components/LoadingIframe';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonDelete: {
            color: "red",
            border: "1px solid red",
            "&:hover": {
                borderColor: "red",
                backgroundColor: "#ffcdd2",

            },
        }
    }),
);


export type BuilderProps = {
    accountId: string,
}

export type LinkCardProps = {
    onDelete?: Function
    id: number

}


function IframeSkeleton() {
    
    return (
        <div style={{ display: 'flex' , width:"100%" , height:"100%" , justifyContent:"center" , alignItems:"center"  , ...SelenaDummyLinks.bodyStyle}}>
            <CircularProgress color="primary"  /> 
            
        </div>
    )
}


function LinkCard(props: LinkCardProps) {
    const classes = useStyles()
    const { id, onDelete } = props
    const [isEnter, setIsEnter] = React.useState(true)
    const onDel = () => {
        setIsEnter(false)
        window.setTimeout(() => onDelete && onDelete(id), 250)

    }
    return (

        <Slide direction={!isEnter && isMoible() ? "left" : "right"} in={isEnter} >
            <Card style={{ minWidth: 275, marginTop: "20px", marginBottom: "20px" }}>

                <CardContent>

                    <FormControl fullWidth={true} style={{ display: "flex", marginTop: "20px" }}>
                        <div>
                            <TextField id={`link-title-${id}`} label="Link Label" variant="outlined" placeholder="My New Website !" fullWidth />

                        </div>


                    </FormControl>

                    <FormControl fullWidth={true} style={{ display: "flex", marginTop: "20px" }}>
                        <div>
                            <TextField id={`link-href-${id}`} label="Location" variant="outlined" placeholder="https://www.google.com" fullWidth />

                        </div>
                    </FormControl>





                </CardContent>
                <CardActions style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" color="secondary" endIcon={<ImageOutlined />}>Icon</Button>
                    <Button variant="outlined" className={classes.buttonDelete} color="primary" endIcon={<DeleteForever style={{ color: "red" }} />} onClick={onDel}>Delete</Button>
                </CardActions>
            </Card>
        </Slide>
    )
}

type buttonList = Array<{ id: number }>






export default function Builder(props: BuilderProps) {

    let { accountId } = props
    const DefaultPageProps: PageProps = SelenaDummyLinks

    const [previewData, setPreviewData] = React.useState(DefaultPageProps)

    const [isMobilePreviewOpen, setIsMobilePreviewOpen] = React.useState(false)

    const [buttons, setCardButtons] = React.useState([] as buttonList)
    const SendPreviewToIframe = (p: PagePropEvent) => {
        let el = document.getElementById(isMoible() ? "links_to_social_device_ifr_mobile" : "links_to_social_device_ifr") as HTMLIFrameElement

        el.contentWindow?.postMessage(p)
    }

    const onPostMessageChildFrame = (msg) => {
        let data = msg.data
        let ev = data as PageOutBoundEvent

        switch (ev.type) {
            case TypePageCloseEvent:
                setIsMobilePreviewOpen(false)
                break;
        }
    }

    React.useEffect(() => {
        window.addEventListener('message', onPostMessageChildFrame)
    }, [])

    useInterval(() => {
        const config = GetConfigFromUI()
        SendPreviewToIframe({ ...config, type: TypePageProps })
    }, 250)

    const OnAddButtonClick = () => {
        setCardButtons([...buttons, { id: buttons.length }])
    }

    const onDeletedButton = (id: number) => {
        setCardButtons(buttons.filter((el) => {
            return el.id != id
        }))
    }

    const onMobilePreview = () => {
        setIsMobilePreviewOpen(true)
    }

    const onMobilePreviewClose = () => {
        setIsMobilePreviewOpen(false)
    }

    const GetConfigFromUI = (): PageProps => {
        let links: LinkProp[] = buttons.map(({ id }, _) => {

            let titleEl = document.getElementById(`link-title-${id}`) as HTMLTextAreaElement
            let hrefEl = document.getElementById(`link-href-${id}`) as HTMLTextAreaElement
            return {
                label: titleEl.value as string,
                url: hrefEl.value as string,
                thumbUrl: ""
            }
        })

        return {
            accountId: accountId,
            profilePicURL: "",
            links: links,
            bodyStyle: SelenaDummyLinks.bodyStyle,
            showExitButton: true
        }
    }


    return (






        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ flex: 1, borderRight: isMoible() ? "none" : "2px gray solid", width: "100%", display: "flex", justifyContent: "center" }}>
                <div style={{ width: "90%" }}>
                    <TextField id={`page-title-input`} variant="outlined" placeholder="My Cool Page" color="secondary" fullWidth />

                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Button startIcon={<ImageOutlined />} endIcon={<Add />} color="secondary" fullWidth variant="outlined" style={{ display: isMoible() ? "" : "none" }}>Avatar</Button>
                        <ButtonGroup fullWidth style={{ display: isMoible() ? "none" : "" }}>
                            <Button startIcon={<ImageOutlined />} endIcon={<Add />} color="secondary" fullWidth variant="outlined">Avatar</Button>
                            <Button onClick={OnAddButtonClick} endIcon={<Add />} color="secondary" fullWidth variant="outlined"> Link</Button>

                        </ButtonGroup>
                    </div>
                    <div style={{ minHeight: `${document.documentElement.clientHeight - 350}px` }}>
                        {buttons.map(({ id }, _) => { return (<LinkCard key={id} id={id} onDelete={onDeletedButton}></LinkCard>) })}
                    </div>




                </div>
            </div>
            <SpeedDialTooltipOpen isHidden={!isMoible()} actions={[
                { icon: <Visibility />, name: 'preview', onClick: onMobilePreview },
                { icon: <Add />, name: 'Link', onClick: OnAddButtonClick }
            ]} />
            <div style={{ display: isMoible() ? "none" : "flex", width: "450px", justifyContent: "center" }}>

                <iframe id="links_to_social_device_ifr" style={{
                    border: "16px black solid",
                    borderTopWidth: "60px",
                    borderBottomWidth: "60px",
                    borderRadius: "36px",
                }} width="350px" height="700" src="http://localhost:3000/builder-view"></iframe>

            </div>

            <Modal
                open={isMobilePreviewOpen}
                onClose={onMobilePreviewClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"

            >
                <Slide in={isMobilePreviewOpen} direction={isMobilePreviewOpen ? "up" : "down"}>
                    <Box >
                        <div style={{ display: "flex", justifyContent: "center", width: "100vw", height: "100vh", alignItems: "center" }}>
                            <div style={{ display: isMoible() ? "flex" : "none", justifyContent: "center", width: "90vw", height: "80vh" }}>

                                {/* <iframe id="links_to_social_device_ifr_mobile" style={{
                                    border: "none"
                                }} width="100%" height="100%" src={`${window.location.origin}/builder-view`}></iframe> */}

                                <LoadingIframe
                                    id="links_to_social_device_ifr_mobile"
                                    skeleton={<IframeSkeleton />}
                                    src={`${window.location.origin}/builder-view`}
                                    frameBorder = {0}
                                    width = "100%"
                                    height = "100%"
                                />

                            </div>
                        </div>

                    </Box>
                </Slide>
            </Modal>


        </div>


    );
}