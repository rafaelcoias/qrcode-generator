import React from 'react';

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen '>
            <p className='absolute top-8 left-8 text-[1.2rem] cursor-pointer' onClick={() => window.history.back()}>🡐&ensp;Back</p>
            <h1 className='text-[3.5rem]'>404 Error</h1>
            <p className='text-[1.2rem]'>This page does not exist</p>
        </div>
    );
}

