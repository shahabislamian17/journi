export default function Template({ html = "" }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
