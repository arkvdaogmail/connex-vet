import { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import cn from "classnames";
import useTasksStore from "@/store/useTasksStore";
import styles from "./Title.module.sass";

type TitleProps = {
    className?: string;
    groupId: string;
    taskId: string;
    value: string;
    edit: boolean;
    setEdit: (edit: boolean) => void;
};

const Title = ({
    className,
    groupId,
    taskId,
    value,
    edit,
    setEdit,
}: TitleProps) => {
    const { updateTitleTask } = useTasksStore((state) => state);
    const [title, setTitle] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleEditTitle = () => {
        setEdit(!edit);
    };

    const handleTitleChange = (e: any) => {
        const newTitle = e.target.value;
        if (newTitle.length <= 140) {
            setTitle(newTitle);
        }
    };

    const handleTitleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            updateTitleTask(groupId, taskId, title);
            setEdit(false);
        }
    };

    const handleBlur = () => {
        updateTitleTask(groupId, taskId, title);
        setEdit(false);
    };

    const focusTextareaAtEnd = () => {
        if (textareaRef.current) {
            const len = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(len, len);
            textareaRef.current.focus();
        }
    };

    useEffect(() => {
        if (edit) {
            focusTextareaAtEnd();
        }
    }, [edit]);

    return edit ? (
        <TextareaAutosize
            className={styles.input}
            maxRows={5}
            autoFocus
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleBlur}
            ref={textareaRef}
        />
    ) : (
        <div className={cn(className, styles.title)} onClick={handleEditTitle}>
            {value}
        </div>
    );
};

export default Title;


