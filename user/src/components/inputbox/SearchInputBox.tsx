import React, { useEffect, useState } from 'react';
import useGoogleLogin from '@lib/hook/use-google-login';
import { Typography } from 'antd';
import { FaGoogle } from 'react-icons/fa';

const { Text } = Typography;

interface IProps {
    onChange: (e:any) => void;
}
const SearchInputBox = ({ onChange }: IProps) => {
    return (
        <div>
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input onChange={(e) => onChange(e)} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm border-2 border-primaryColor rounded-lg bg-secoundaryColor text-textColor " placeholder="Search ..." required />
                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-primaryColor font-medium rounded-lg text-sm px-4 py-2 ">Search</button>
            </div>
        </div>
    )
};

export default SearchInputBox;
