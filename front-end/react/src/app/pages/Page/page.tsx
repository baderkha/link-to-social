import * as React from 'react';
import { Avatar, Typography } from '@material-ui/core';
import { LinkProp } from 'app/components/link';
import { LinkCollection } from 'app/components/link';
import { Logo } from 'app/components/Logo';

export type PageProps = {
    profilePicURL: string;
    accountId: string;
    links: LinkProp[];
};

export const SelenaDummyLinks: PageProps = {
    accountId: 'selena_gomez_123',
    profilePicURL:
        'https://d1fdloi71mui9q.cloudfront.net/K4raBh2LTmWiW4n25ayC_nkqHepUDwExgpOT0',
    links: [
        {
            label: 'Listen to Joe Mama',
            url: 'https://google.com',
            thumbUrl:
                'https://d1fdloi71mui9q.cloudfront.net/N4vHeHS2TsWiBBIErV7h_NCGJHp7Wl300L1ce',
        },
        {
            label: 'Listen to Joe Mama',
            url: 'https://google.com',
            thumbUrl:
                'https://d1fdloi71mui9q.cloudfront.net/85JqpOdgQ7mu90iSSqTT_1TXaVw6XYvq0dFYa',
        },
        {
            label: 'Listen to Joe Mama',
            url: 'https://google.com',
            thumbUrl:
                'https://d1fdloi71mui9q.cloudfront.net/N4vHeHS2TsWiBBIErV7h_NCGJHp7Wl300L1ce',
        },
        {
            label: 'Listen to Joe Mama',
            url: 'https://google.com',
            thumbUrl:
                'https://d1fdloi71mui9q.cloudfront.net/N4vHeHS2TsWiBBIErV7h_NCGJHp7Wl300L1ce',
        },
        {
            label: 'Listen to Joe Mama',
            url: 'https://google.com',
            thumbUrl:
                'https://d1fdloi71mui9q.cloudfront.net/N4vHeHS2TsWiBBIErV7h_NCGJHp7Wl300L1ce',
        },
        {
            label: 'Listen to Joe Mama',
            url: 'https://google.com',
            thumbUrl:
                'https://d1fdloi71mui9q.cloudfront.net/N4vHeHS2TsWiBBIErV7h_NCGJHp7Wl300L1ce',
        },
        {
            label: 'Listen to Joe Mama',
            url: 'https://google.com',
            thumbUrl:
                'https://d1fdloi71mui9q.cloudfront.net/85JqpOdgQ7mu90iSSqTT_1TXaVw6XYvq0dFYa',
        },
    ],
};

const Page = (props: PageProps) => {
    let { accountId, links, profilePicURL } = props;
    return (
        <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
            <div style={{ width: '80%', display: 'inline-block' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <figure
                        style={{
                            width: '144px',
                            height: '144px',
                            display: 'inline-block',
                        }}
                    >
                        <Avatar
                            alt="Profile Picture"
                            style={{ width: '100%', height: '100%' }}
                            src={profilePicURL}
                        ></Avatar>

                        <figcaption>
                            {' '}
                            <Typography
                                style={{
                                    textAlign: 'center',
                                    overflowWrap: 'break-word',
                                }}
                            >
                                @{accountId}
                            </Typography>
                        </figcaption>
                    </figure>
                </div>
                <div style={{ width: '100%' }}>
                    <LinkCollection
                        links={links}
                        height={'100%'}
                        width={'100%'}
                    />
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Logo size="small"></Logo>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Page;
