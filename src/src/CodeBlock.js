import React from 'react';
import { nord as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

theme['hljs-comment'].color = '#81A1C1';

const style = {
  backgroundColor: '#3b4d61',
  padding: '2em',
  borderRadius: '5px',
  marginTop: '2em',
  marginBottom: '2em'
};

export default props =>
    <SyntaxHighlighter language='python' style={theme} customStyle={style} {...props}>
    </SyntaxHighlighter>

