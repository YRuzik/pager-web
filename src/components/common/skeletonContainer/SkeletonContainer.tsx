import {FC} from "react";
import './skeletonContainer.scss'

type SkeletonContainerProps = {
    width?: number
    height?: number
}
const SkeletonContainer: FC<SkeletonContainerProps> = ({width, height = 25}) => {
    return (
        <div style={{width: `${width ?? 100}%`, height: height}}>
            <div className={"skeleton-wrapper"}></div>
        </div>
    )
}

export default SkeletonContainer