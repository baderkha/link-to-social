import * as React from 'react';
import { Avatar, IconButton, Typography } from '@material-ui/core';
import { LinkProp } from 'app/components/link';
import { LinkCollection } from 'app/components/link';
import { Logo } from 'app/components/Logo';
import { ShareButton } from 'app/components/ShareButton';
import { EmptyLinks } from './blank_page';
import { SelenaDummyLinks } from './selena_test';
import { Fade } from "@material-ui/core"
import { CloseRounded } from '@material-ui/icons'

export const TypePageProps = "links_to_social_page_props"
export const TypePageCloseEvent = "links_to_social_page_close_iframe"
export type PageProps = {
    profilePicURL: string,
    accountId: string,
    links: LinkProp[],
    bodyStyle?: Object,
    showExitButton?: boolean,
}

export type PagePropEvent = PageProps & {
    type: string
}

export type PageOutBoundEvent = {
    type: string
}


export const PageContext = React.createContext({
    isOnPage: false,
});

const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}





export default function Page(pageProps: PageProps) {
    const [props, setProps] = React.useState(pageProps)
    let { accountId, links, profilePicURL, showExitButton } = props
    const applyBody = (props: PageProps) => {
        let bodyStyle = props.bodyStyle ? props.bodyStyle : SelenaDummyLinks.bodyStyle
        for (let styleKey in bodyStyle) {
            let styleValue = bodyStyle[styleKey]
            document.body.style[styleKey] = styleValue
        }

    }
    const onPostMessage = (msg) => {
        let data = msg.data
        console.log(data)
        let pageProps = data as PagePropEvent
        if (data["type"] != TypePageProps) return

        setProps(pageProps)
        applyBody(pageProps)


    }

    // for seccurity reasons 
    const exitButtonOnClick = (ev) => {
        const e: PageOutBoundEvent = {
            type: TypePageCloseEvent
        }
        window.parent.postMessage(e)
    }

    React.useEffect(() => {

        if (inIframe()) {
            window.addEventListener('message', onPostMessage)
        } else {
            applyBody(props)
        }


    }, [])
    return (
        <PageContext.Provider value={{ isOnPage: true }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "100%", display: "inline-block" }}>
                        <div style={{ width: "100%", justifyContent: "space-between", display: showExitButton ? "flex" : "none" }}>
                            <div />
                            <IconButton onClick={exitButtonOnClick} children={<CloseRounded color={"error"} />}></IconButton>
                        </div>
                        <div style={{ width: "100%", justifyContent: "space-between", display: "flex" }}>
                            <div />
                            <ShareButton color="primary"></ShareButton>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px", }}>



                            <figure style={{ width: "144px", height: "144px", display: "inline-block" }}>
                                <Avatar alt="Profile Picture" style={{ width: "100%", height: "100%" }} src={profilePicURL}>



                                </Avatar>

                                <figcaption>  <Typography style={{ textAlign: "center", overflowWrap: "break-word", fontWeight: "bold" }}>@{accountId}</Typography>
                                </figcaption>

                            </figure>



                        </div>
                        <div style={{ width: "100%" }}>
                            <LinkCollection links={links} height={"100%"} width={"100%"} />

                        </div>

                    </div>


                </div>
        </PageContext.Provider>





    );
}