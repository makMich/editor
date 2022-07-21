import './App.css';
import { createEditor, Editor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
    },
];

const App = () => {
    const [editor] = useState(() => withReact(createEditor()));

    const renderElement = useCallback((props) => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />;
            default:
                return <DefaultElement {...props} />;
        }
    }, []);

    return (
        <Slate editor={editor} value={initialValue}>
            <Editable
                renderElement={renderElement}
                onKeyDown={(event) => {
                    if (!event.ctrlKey) {
                        return;
                    }

                    switch (event.key) {
                        case '`': {
                            event.preventDefault();
                            const [match] = Editor.nodes(editor, {
                                match: (n) => n.type === 'code',
                            });
                            Transforms.setNodes(
                                editor,
                                { type: match ? 'paragraph' : 'code' },
                                { match: (n) => Editor.isBlock(editor, n) },
                            );
                            break;
                        }
                        case 'b': {
                            event.preventDefault();
                            Transforms.setNodes(
                                editor,
                                { bold: true },
                                { match: (n) => Text.isText(n), split: true },
                            );
                            break;
                        }
                    }
                }}
            />
        </Slate>
    );
};

const CodeElement = (props) => {
    console.log(props);
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    );
};

CodeElement.propTypes = {
    attributes: PropTypes.any,
    children: PropTypes.any,
};

const DefaultElement = (props) => {
    return <p {...props.attributes}>{props.children}</p>;
};

export default App;
