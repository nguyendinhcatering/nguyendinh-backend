import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Label, InputDescription, InputErrors } from "strapi-helper-plugin";
import { Button } from "@buffetjs/core";
import { v4 as uuid } from "uuid";
import EditorJs from "../EditorJs";
import MediaLib from "../MediaLib";
const WysiwygWithErrors = ({
  inputDescription,
  errors,
  label,
  name,
  noErrorsDescription,
  onChange,
  value,
}) => {
  const [isMediaLibOpen, setMediaLibOpen] = useState(false);
  const holder = useRef(name + uuid());
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    if (!isReady) {
      console.log("test");
      setTimeout(() => {
        setReady(true);
      }, 1000);
    }
  }, []);
  let spacer = !isEmpty(inputDescription) ? (
    <div style={{ height: ".4rem" }} />
  ) : (
    <div />
  );

  if (!noErrorsDescription && !isEmpty(errors)) {
    spacer = <div />;
  }

  const handleChange = (data) => {
    const image = {
      type: "image",
      data: {
        file: data,
        caption: data.caption || data.alternativeText || data.name,
        withBorder: false,
        withBackground: false,
        stretched: false,
      },
    };

    let parsedValue = {};
    try {
      const realParsedValue = JSON.parse(value);

      if (realParsedValue) {
        parsedValue = realParsedValue;
      } else {
        parsedValue = {
          blocks: [],
        };
      }
    } catch (err) {
      parsedValue = {
        blocks: [],
      };
    }

    parsedValue.blocks.push(image);

    onChange({ target: { name, value: JSON.stringify(parsedValue) } });
  };

  const handleToggle = () => setMediaLibOpen(!isMediaLibOpen);

  if (!isReady) {
    return <div>Hi</div>;
  }

  return (
    <div
      style={{
        marginBottom: "1.6rem",
        fontSize: "1.3rem",
        fontFamily: "Lato",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "no-wrap",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Label htmlFor={name} message={label} style={{ marginBottom: 10 }} />
        <Button color="primary" onClick={handleToggle}>
          Media library
        </Button>
      </div>
      <EditorJs name={name} onChange={onChange} value={value} holder={holder} />
      <InputDescription
        message={inputDescription}
        style={!isEmpty(inputDescription) ? { marginTop: "1.4rem" } : {}}
      />
      <InputErrors
        errors={(!noErrorsDescription && errors) || []}
        name={name}
      />
      <MediaLib
        onChange={handleChange}
        isOpen={isMediaLibOpen}
        onToggle={handleToggle}
      />
      {spacer}
    </div>
  );
};

WysiwygWithErrors.defaultProps = {
  errors: [],
  label: "",
  noErrorsDescription: false,
};

WysiwygWithErrors.propTypes = {
  errors: PropTypes.array,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  name: PropTypes.string.isRequired,
  noErrorsDescription: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default WysiwygWithErrors;
