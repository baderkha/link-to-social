import * as React from 'react';
import { useInterval } from 'usehooks-ts'
import { Avatar, Typography, Divider, Button, Container, Card, CardContent, CardActions, ButtonGroup, CardHeader, TextField } from '@material-ui/core';
import { Add, ImageOutlined, Visibility, DeleteForever, Save, Image } from "@material-ui/icons"
import { LinkProp } from 'app/components/link';
import { LinkCollection } from 'app/components/link';
import { Logo } from 'app/components/Logo';
import { ShareButton } from 'app/components/ShareButton';
import Page, { PagePropEvent, TypePageProps } from '../Page/page';
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
import { EmptyLinks } from '../Page/blank_page';


export type BuilderProps = {
    accountId: string,
}

export type LinkCardProps = {
    onDelete?: Function
    id: number

}


function LinkCard(props: LinkCardProps) {
    const { id, onDelete } = props
    const onDel = () => {
        onDelete && onDelete(id)
    }
    return (
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
                <Button variant="outlined" color="secondary" endIcon={<ImageOutlined />}>Edit Image</Button>
                <Button variant="outlined" color="default" endIcon={<DeleteForever />} onClick={onDel}>Delete</Button>
            </CardActions>
        </Card>
    )
}

type buttonList = Array<{ id: number }>






export default function Builder(props: BuilderProps) {

    let { accountId } = props
    const DefaultPageProps: PageProps = SelenaDummyLinks

    const [previewData, setPreviewData] = React.useState(DefaultPageProps)
    const [buttons, setCardButtons] = React.useState([] as buttonList)
    const SendPreviewToIframe = (p: PagePropEvent) => {
        let el = document.getElementById("links_to_social_device_ifr") as HTMLIFrameElement
        el.contentWindow?.postMessage(p)
    }

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
            bodyStyle: EmptyLinks.bodyStyle
        }
    }

    return (






        <div style={{ display: "flex", marginTop: "100px", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ flex: 1, borderRight: "2px gray solid", width: "100%", display: "flex", justifyContent: "center" }}>
                <div style={{ width: "90%" }}>


                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <ButtonGroup fullWidth>
                            <Button endIcon={<ImageOutlined />} color="secondary" fullWidth variant="outlined"> Profile Image</Button>
                            <Button onClick={OnAddButtonClick} endIcon={<Add />} color="secondary" fullWidth variant="outlined"> Add a Link</Button>

                        </ButtonGroup>
                    </div>
                    <div style={{ minHeight: "650px" }}>
                        {buttons.map(({ id }, _) => { return (<LinkCard key={id} id={id} onDelete={onDeletedButton}></LinkCard>) })}
                    </div>

                    <Button endIcon={<Save />} color="secondary" fullWidth variant="outlined">Save</Button>


                </div>
            </div>

            <div style={{ width: "450px", "display": "flex", justifyContent: "center" }}>

                <iframe id="links_to_social_device_ifr" style={{
                    border: "16px black solid",
                    borderTopWidth: "60px",
                    borderBottomWidth: "60px",
                    borderRadius: "36px",
                }} width="350px" height="700" src="http://localhost:3000/builder-view"></iframe>

            </div>

        </div>


    );
}