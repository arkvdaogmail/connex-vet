"use client";

import { useState } from "react";
import cn from "classnames";
import Link from "next/link";
import { default as NextImage } from "next/image";
import Icon from "@/components/Icon";
import SimpleList from "@/components/SimpleList";
import styles from '../components/Options/Options.module.sass';

const HomePage = () => {
    const [activeId, setActiveId] = useState(0);

    return (
        <div className={styles.outer}>
            <SimpleList className={styles.simpleList} />
            <Link className={styles.logo} href="/">
                <NextImage
                    src="/images/demo/logo.png"
                    priority={true}
                    width={52}
                    height={52}
                    alt=""
                />
            </Link>
            <div className="">
                <Link
                    className={styles.link}
                    href="https://ui8-bento-landing.vercel.app/"
                >
                    <Icon name="logout" />
                </Link>
                <a
                    className={styles.link}
                    href="https://ui8.net/ui8/products/bento-cards-simplelist"
                    target="_blank"
                >
                    <Icon name="bag" />
                </a>
            </div>
            <div
                className={cn(styles.background, {
                    [styles.visible]: activeId === 1,
                })}
            >
                <NextImage
                    className={styles.image}
                    src="/images/demo/background.png"
                    fill
                    alt=""
                />
            </div>
            <div className={styles.options}>
                <button
                    className={cn(styles.option, {
                        [styles.active]: activeId === 0,
                    })}
                    onClick={() => setActiveId(0)}
                >
                    <div className={styles.circle}></div>
                </button>
                <button
                    className={cn(styles.option, {
                        [styles.active]: activeId === 1,
                    })}
                    onClick={() => setActiveId(1)}
                >
                    <NextImage
                        src="/images/demo/background-small.png"
                        width={44}
                        height={44}
                        alt=""
                    />
                </button>
            </div>
        </div>
    );
};

export default HomePage;


