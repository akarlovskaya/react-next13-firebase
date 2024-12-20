'use client';
import React, { useState } from 'react';
import { FaShare } from "react-icons/fa";

function ShareLink() {
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    return (
        <>
        <button
            type="button"
            aria-label="Share this class"
            title="Copy link to share"
            className="flex text-navy hover:text-navy-light justify-center py-2 px-4 items-center"
            onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
                setShareLinkCopied(false);
            }, 2000);
            }}>
                Share
                <FaShare 
                    aria-hidden="true" 
                    focusable="false"
                    className="mr-2 text-xl pl-2" 
                    title="Copy link to share" />
        </button>
        {shareLinkCopied && (
            <span className="absolute top-0 right-0 text-xs z-10">
            Link Copied
            </span>
        )}
        </>
    )
}

export default ShareLink;