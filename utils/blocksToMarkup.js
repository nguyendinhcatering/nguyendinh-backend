const React = require("react");
const cn = require("classnames");
const { compiler } = require("markdown-to-jsx");
const ReactDomServer = require("react-dom/server");

const preprocessBlocks = (blocks) => {
  if (!blocks) return [];
  const result = [];

  let currentBlocks = { type: "col", blocks: [] };
  let currentRowBlocks = [];

  blocks.forEach((block) => {
    if (block.type === "columnStart") {
      if (currentBlocks.blocks.length !== 0) {
        result.push(currentBlocks);
      }

      currentBlocks = { type: "row", blocks: [] };
    } else if (block.type === "columnEnd") {
      if (currentRowBlocks.length !== 0) {
        currentBlocks.blocks.push(currentRowBlocks);
        currentRowBlocks = [];
      }
      if (currentBlocks.blocks.length !== 0) {
        result.push(currentBlocks);
      }

      currentBlocks = { type: "col", blocks: [] };
    } else {
      if (currentBlocks.type === "row") {
        if (block.type === "columnSplit") {
          if (currentRowBlocks.length !== 0) {
            currentBlocks.blocks.push(currentRowBlocks);
            currentRowBlocks = [];
          }
        } else {
          currentRowBlocks.push(block);
        }
      } else {
        currentBlocks.blocks.push(block);
      }
    }
  });

  if (currentBlocks.blocks.length !== 0) {
    result.push(currentBlocks);
  }

  return result;
};

const parseData = (data) => {
  try {
    const blockData = JSON.parse(data);

    if (blockData) {
      return blockData.blocks;
    }

    return [];
  } catch (err) {
    return [];
  }
};

class Color extends React.Component {
  render() {
    return React.createElement("span", {
      style: {
        color: this.props.color,
      },
      children: this.props.children,
    });
  }
}

class Heading extends React.Component {
  render() {
    const tag = `h${this.props.level}`;

    const tagToTextSize = {
      h1: "xl",
      h2: "lg",
      h3: "md",
      h4: "sm",
      h5: "sm",
    };

    return React.createElement(tag, {
      className: cn(
        this.props.alignment ? `text-${this.props.alignment}` : undefined,
        `text-${tagToTextSize[tag]}`
      ),
      children: compiler(this.props.text, {
        forceInline: true,
        overrides: {
          font: Color,
        },
      }),
    });
  }
}

class Paragraph extends React.Component {
  render() {
    return React.createElement("p", {
      className: this.props.alignment
        ? `text-${this.props.alignment}`
        : undefined,
      children: compiler(this.props.text, {
        forceInline: true,
        overrides: {
          font: Color,
        },
      }),
    });
  }
}

class List extends React.Component {
  render() {
    const tag = this.props.style === "unordered" ? "ul" : "ol";
    return React.createElement(tag, {
      children: this.props.items.map((text) =>
        React.createElement("li", { children: compiler(text) })
      ),
    });
  }
}

const renderEditorData = (editorData) => {
  let res = "";

  const preprocessedBlocks = preprocessBlocks(parseData(editorData)).filter(
    (block) => block.type === "col"
  );

  preprocessedBlocks.forEach((blockGroup) => {
    blockGroup.blocks.forEach((block) => {
      if (block.type === "header") {
        res += ReactDomServer.renderToStaticMarkup(
          React.createElement(Heading, block.data)
        );
      } else if (block.type === "paragraph") {
        res += ReactDomServer.renderToStaticMarkup(
          React.createElement(Paragraph, block.data)
        );
      } else if (block.type === "list") {
        res += ReactDomServer.renderToStaticMarkup(
          React.createElement(List, block.data)
        );
      }
    });
  });

  console.log("res", res);

  return res;
};

module.exports = exports = {
  renderEditorData,
};
