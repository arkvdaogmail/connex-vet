import cn from "classnames";
import Icon from "@/components/Icon";
import styles from "./Options.module.sass";

type ItemsType = {
    title: string;
    icon: string;
    onClick: () => void;
};

type OptionsProps = {
    className?: string;
    items: ItemsType[];
    index: number;
    isActive: boolean;
};

const Options = ({ className, items, index, isActive }: OptionsProps) => {
    return (
        <div
            className={cn(className, styles.actions, {
                [styles.visible]: isActive,
            })}
        >
            {items.map((item, indexItem) => (
                <button
                    className={styles.action}
                    onClick={item.onClick}
                    key={indexItem}
                >
                    <Icon name={item.icon} />
                    <div
                        className={cn(styles.tooltip, {
                            [styles.tooltipDown]: index === 0,
                        })}
                    >
                        {item.title}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default Options;


