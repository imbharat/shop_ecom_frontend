import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    collapsed: boolean;
};

function ProfilePic({ collapsed } : Props) {
  return (
    <div className={classNames({
            "grid place-content-stretch p-2": true,
        })}
        >
        <div className="flex gap-4 items-center h-11 overflow-hidden">
            <Image
                src={"/profile.png"}
                height={36}
                width={36}
                alt="profile image"
                className="rounded-full"
            />
            {!collapsed && (
            <div className="flex flex-col">
                <span className="my-0">Tom Cook</span>
            </div>
            )}
        </div>
    </div>
  )
}

export default ProfilePic