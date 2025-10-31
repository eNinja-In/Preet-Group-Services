import style from "./footbar.module.css"
export default function Footbar (){
    return(
        <div className={style.main}>
            <div className={style.footer1}></div>
            <div className={style.footer2}></div>
        </div>
    )
}