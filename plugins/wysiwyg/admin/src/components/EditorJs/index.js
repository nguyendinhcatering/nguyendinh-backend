import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ImageTool from "@editorjs/image";
import { auth, request } from "strapi-helper-plugin";
import EditorJs from "@natterstefan/react-editor-js";
import Header from "./plugins/header/bundle";
import Paragraph from "./plugins/paragraph/bundle";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Link from "@editorjs/link";
import LinkButtonTool from "./plugins/link-button/bundle";
import AccordionTool from "./plugins/accordion/bundle";
import ColumnTool from "./plugins/column/bundle";
import ColorPlugin from "editorjs-text-color-plugin";
import { isEqual } from "lodash";

const { ColumnStart, ColumnEnd, ColumnSplit } = ColumnTool;

const Wrapper = styled.div`
  .editorjs__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const useDeepEffect = (effectFunc, deps) => {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isSame = prevDeps.current.every((obj, index) =>
      isEqual(obj, deps[index])
    );

    if (isFirst.current || !isSame) {
      effectFunc();
    }

    isFirst.current = false;
    prevDeps.current = deps;
  }, deps);
};

const Editor = ({ onChange, name, value, holder }) => {
  var editor = null;
  const [isReady, setReady] = React.useState(false);

  const onSave = async () => {
    try {
      const outputData = await editor.save();
      const dataString = JSON.stringify(outputData);
      onChange({ target: { name, value: dataString } });
      console.log("Saving data: " + dataString);
    } catch (e) {
      console.error("Saving failed: ", e);
    }
  };

  const parseData = (data) => {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.log(data, "could not be parsed");
      return { blocks: [] };
    }
  };

  useDeepEffect(() => {
    const updateFunc = async () => {
      if (!isReady) return;
      const newValue = parseData(value);

      if (
        editor &&
        newValue.blocks &&
        newValue.blocks.length > 0 &&
        newValue.blocks[newValue.blocks.length - 1].type === "image"
      ) {
        await editor?.render(newValue);
      }
    };

    if (value) {
      updateFunc();
    }
  }, [parseData(value)?.blocks]);

  return (
    <Wrapper>
      <EditorJs
        data={parseData(value)}
        onChange={onSave}
        onReady={() => {
          setReady(true);
        }}
        tools={{
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
          },
          columnStart: ColumnStart,
          columnSplit: ColumnSplit,
          columnEnd: ColumnEnd,
          paragraph: {
            class: Paragraph,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
              },
            },
          },
          Color: {
            class: ColorPlugin,
            config: {
              colorCollections: ["#FFFFFF", "#000000", "#e10019"],
              defaultColor: "#000000",
              type: "text",
            },
          },
          // marker: {
          //   class: ColorPlugin,
          //   config: {
          //     defaultColor: "#FFBF00",
          //     type: "marker",
          //   },
          // },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          linkButton: {
            class: LinkButtonTool,
          },
          accordion: {
            class: AccordionTool,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: `${strapi.backendURL}/upload`, // Your backend file uploader endpoint
                byUrl: `${strapi.backendURL}/upload`, // Your endpoint that provides uploading by Url
              },
              additionalRequestHeaders: {
                authorization: `Bearer ${auth.getToken()}`,
              },
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */
                uploadByFile(file) {
                  // your own uploading logic here
                  const formData = new FormData();
                  formData.append("files", file);
                  const headers = {};

                  return request(
                    "/upload",
                    { method: "POST", headers, body: formData },
                    false,
                    false
                  ).then((resp) => {
                    return {
                      success: 1,
                      file: {
                        url: `${strapi.backendURL}${resp[0].url}`,
                      },
                    };
                  });
                },
              },
            },
          },
          linkTool: {
            class: Link,
            inlineToolbar: true,
            config: {
              endpoint: "http://example.com",
            },
          },
        }}
        editorInstance={(editorInstance) => {
          editor = editorInstance;
        }}
        holder={holder.current}
        initialBlock="paragraph"
      >
        <div
          id={holder.current}
          style={{
            backgroundColor: "white",
            marginTop: "16px",
            paddingTop: "16px",
          }}
        />
      </EditorJs>
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Editor;
