import { useEffect, useState } from "react";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import Icon from "@/components/Icon";
import useTasksStore from "@/store/useTasksStore";
import Title from "@/components/Title"; // Adjusted import path
import Options from "@/components/Options"; // Adjusted import path
import styles from "./Task.module.sass";

type ItemType = {
    id: string;
    title: string;
    completed: boolean;
};

type TaskProps = {
    groupId: string;
    item: ItemType;
    index: number;
};

const Task = ({ groupId, item, index }: TaskProps) => {
    const { toggleTaskCompletion, duplicateTask, deleteTask } = useTasksStore(
        (state) => state
    );
    const [edit, setEdit] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFadingIn, setIsFadingIn] = useState(false);

    const options = [
        {
            title: "Duplicate",
            icon: "copy",
            onClick: () => {
                setIsFadingIn(true);
                duplicateTask(groupId, item.id);
            },
        },
        {
            title: "Delete",
            icon: "trash",
            onClick: () => {
                setIsFadingOut(true);
                setTimeout(() => deleteTask(groupId, item.id), 150);
            },
        },
    ];

    useEffect(() => {
        if (isFadingOut) {
            const timer = setTimeout(() => {
                setIsFadingOut(false);
            }, 150);
            return () => clearTimeout(timer);
        }
        if (isFadingIn) {
            const timer = setTimeout(() => {
                setIsFadingIn(false);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [isFadingOut, isFadingIn]);

    const handleDragClick = () => {
        setVisible(!visible);
        setEdit(false);
    };

    return (
        <div
            className={cn(styles.task, {
                [styles.completed]: item.completed,
                [styles.showOptions]: visible,
                [styles.fadeOut]: isFadingOut,
                [styles.fadeIn]: isFadingIn,
            })}
        >
            <div className={styles.inner}>
                <div
                    className={styles.radio}
                    onClick={() => toggleTaskCompletion(groupId, item.id)}
                ></div>
                <Title
                    className={styles.title}
                    groupId={groupId}
                    taskId={item.id}
                    value={item.title}
                    edit={edit}
                    setEdit={setEdit}
                />
                <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
                    <div className={styles.drag} onClick={handleDragClick}>
                        <Icon name="drag" />
                    </div>
                    <Options items={options} index={index} isActive={visible} />
                </OutsideClickHandler>
            </div>
        </div>
    );
};

export default Task;


