import dynamic from 'next/dynamic'

type Props = {
    children: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}

function PreventSSR(props : Props) {
  return <>
    {
        props.children
    }
  </>
}

export default dynamic(() => Promise.resolve(PreventSSR), {
    ssr: false
});