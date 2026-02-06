
export default function Button ({children, ...prop}){

    return (
        <>
    
        <button {...prop} >{children}</button>
        
        </>
    )
}