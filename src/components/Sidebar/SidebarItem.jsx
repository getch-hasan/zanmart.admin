import { useState } from "react"
import { IoIosArrowUp ,IoIosArrowDown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

export default function SidebarItem({item}){
    const [open, setOpen] = useState(false) 
    const {pathname} = useLocation();   
    if(item.childrens){
        return (
            <div className={open ? "sidebar-item open" : "sidebar-item "} >
                <div className={ ` ${pathname===item?.path?'bg-gray-500 ':''} px-2.5 py-2 rounded-md  cursor-pointer flex items-center hover:bg-gray-500 justify-between`} onClick={() => setOpen(!open)}>
                <div className="flex gap-2 items-center">
                <span>{item?.icon}</span>
                <span> {item.title}</span>
                </div>
                   {open? <IoIosArrowDown />:<IoIosArrowUp />}
                </div>
                <div className="sidebar-content ml-2  ">
                    { item.childrens.map((child, index) => <SidebarItem key={index} item={child} />) }
                </div>
            </div>
        )
    }else{
        return (
            <Link to={item.path} className={`${pathname===item?.path?'bg-gray-500':''} sidebar-item plain flex  items-center gap-2 py-2 px-3 bg  rounded-md hover:bg-gray-500`}>
                 <span>{item?.icon}</span>
                <span> {item.title}</span>
            </Link>
        )
    }
}