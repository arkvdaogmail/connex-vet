import OutsideClickHandler from "react-outside-click-handler";
import cn from "classnames";
import { useHotkeys } from "react-hotkeys-hook";
import Icon from "@/components/Icon";
import useEventsStore from "@/store/useEventsStore";
import useTasksStore from "@/store/useTasksStore";
import styles from "./IconSelection.module.sass";

type IconSelectionProps = {
    selectedIcon: string;
    setSelectedIcon: (icon: string) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    down?: boolean;
    activeGroupIcons: string;
    setActiveGroupIcons: (id: string) => void;
    groupId: string;
    onClick?: () => void;
};

const IconSelection = ({
    selectedIcon,
    setSelectedIcon,
    selectedColor,
    setSelectedColor,
    down,
    activeGroupIcons,
    setActiveGroupIcons,
    groupId,
    onClick,
}: IconSelectionProps) => {
    const { isOpenIcons, toggleIcons, closeIcons, setActiveGroupOptionsId } =
        useEventsStore((state) => state);

    const { updateIconGroup, updateIconColorGroup } = useTasksStore(
        (state) => state
    );

    useHotkeys("esc", closeIcons);

    const icons = [
        "home",
        "star",
        "airpod",
        "cmd",
        "add-user",
        "eye",
        "check-circle",
        "game",
        "loader",
        "heart",
        "image",
        "memory",
        "note",
        "quotes",
    ];

    const colors = [
        "#CBCBCB",
        "#FF7474",
        "#FFA502",
        "#FFFA65",
        "#2ECC71",
        "#DEB4F6",
        "#B4AAFF",
    ];

    return (
        <OutsideClickHandler
            onOutsideClick={() => activeGroupIcons === groupId && closeIcons()}
        >
            <div
                className={cn(styles.iconSelection, {
                    [styles.visible]:
                        activeGroupIcons === groupId && isOpenIcons,
                })}
            >
                <button
                    className={styles.head}
                    onClick={() => {
                        setActiveGroupIcons(groupId);
                        toggleIcons();
                        setActiveGroupOptionsId(null);
                        onClick && onClick();
                    }}
                >
                    <Icon name={selectedIcon} fill={selectedColor} />
                </button>
                <div className={cn(styles.body, { [styles.bodyDown]: down })}>
                    <div className={styles.inner}>
                        <div className={styles.group}>
                            <div className={styles.category}>Icon</div>
                            <div className={styles.icons}>
                                {icons.map((icon, index) => (
                                    <button
                                        className={cn(styles.icon, {
                                            [styles.selected]:
                                                icon === selectedIcon,
                                        })}
                                        key={index}
                                        onClick={() => {
                                            groupId === "new-group"
                                                ? setSelectedIcon(icon)
                                                : setSelectedIcon(icon);
                                            updateIconGroup(groupId, icon);
                                        }}
                                    >
                                        <Icon name={icon} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.group}>
                            <div className={styles.category}>Color</div>
                            <div className={styles.colors}>
                                {colors.map((color, index) => (
                                    <button
                                        className={cn(styles.color, {
                                            [styles.selected]:
                                                color === selectedColor,
                                        })}
                                        key={index}
                                        onClick={() => {
                                            groupId === "new-group"
                                                ? setSelectedColor(color)
                                                : setSelectedColor(color);
                                            updateIconColorGroup(
                                                groupId,
                                                color
                                            );
                                        }}
                                    >
                                        <div
                                            className={styles.circle}
                                            style={{
                                                backgroundColor: color,
                                            }}
                                        ></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OutsideClickHandler>
    );
};

export default IconSelection;
