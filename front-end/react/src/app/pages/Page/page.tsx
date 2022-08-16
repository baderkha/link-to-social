import * as React from 'react';
import { Avatar, Typography } from '@material-ui/core';
import { LinkProp } from 'app/components/link';
import { LinkCollection } from 'app/components/link';
import { Logo } from 'app/components/Logo';
import { ShareButton } from 'app/components/ShareButton';

export const TypePageProps = "links_to_social_page_props"

export type PageProps = {
    profilePicURL: string,
    accountId: string,
    links: LinkProp[],
    bodyStyle: Object
}

export type PagePropEvent = PageProps & {
    type: string
}


export const PageContext = React.createContext({
    isOnPage : false , 
});

const inIframe = ()=> {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}





export default function Page(pageProps: PageProps) {
    const [props , setProps] = React.useState(pageProps)
    let { accountId, links, profilePicURL } = props
    const applyBody = (props : PageProps) => {
        if (props.bodyStyle) {
            for (let styleKey in props.bodyStyle) {
                let styleValue = props.bodyStyle[styleKey]
                document.body.style[styleKey] = styleValue
            }
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
    React.useEffect(() => {

        if (inIframe()) {
            window.addEventListener('message',onPostMessage)
        } else {
           applyBody(props)
        }

        
    }, [])
    return (
        <PageContext.Provider value={{isOnPage : true}}>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", display: "inline-block" }}>
                <div style={{ width: "100%" , justifyContent:"end" , display:"flex"}}>

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