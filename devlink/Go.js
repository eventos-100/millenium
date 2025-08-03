"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
  '{"events":{"e-23":{"id":"e-23","name":"","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-24"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".hero-grid__subheading.hero-grid__subheading--alight-left","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278cf","appliesTo":"CLASS"},"targets":[{"selector":".hero-grid__subheading.hero-grid__subheading--alight-left","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278cf","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159255668},"e-24":{"id":"e-24","name":"","animationType":"custom","eventTypeId":"SCROLL_OUT_OF_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-23"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".hero-grid__subheading.hero-grid__subheading--alight-left","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278cf","appliesTo":"CLASS"},"targets":[{"selector":".hero-grid__subheading.hero-grid__subheading--alight-left","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278cf","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159255706},"e-25":{"id":"e-25","name":"","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-26"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".ludicrous__heading","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d1","appliesTo":"CLASS"},"targets":[{"selector":".ludicrous__heading","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d1","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159269908},"e-26":{"id":"e-26","name":"","animationType":"custom","eventTypeId":"SCROLL_OUT_OF_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-25"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".ludicrous__heading","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d1","appliesTo":"CLASS"},"targets":[{"selector":".ludicrous__heading","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d1","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159269910},"e-27":{"id":"e-27","name":"","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-28"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".button.button--dark","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d3","appliesTo":"CLASS"},"targets":[{"selector":".button.button--dark","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d3","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159297749},"e-28":{"id":"e-28","name":"","animationType":"custom","eventTypeId":"SCROLL_OUT_OF_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-27"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".button.button--dark","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d3","appliesTo":"CLASS"},"targets":[{"selector":".button.button--dark","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d3","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159297787},"e-29":{"id":"e-29","name":"","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-30"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".paragraph__animated","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d6","appliesTo":"CLASS"},"targets":[{"selector":".paragraph__animated","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d6","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159317255},"e-30":{"id":"e-30","name":"","animationType":"custom","eventTypeId":"SCROLL_OUT_OF_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-29"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".paragraph__animated","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d6","appliesTo":"CLASS"},"targets":[{"selector":".paragraph__animated","originalId":"687bbc3b0bb3dd57d6c1fdc2|eadc0780-6da9-e9af-b69a-f694cab278d6","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159317256},"e-37":{"id":"e-37","name":"","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-38"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".data-grid__item","originalId":"687bbc3b0bb3dd57d6c1fdc2|360ccfe7-4b62-2092-a8bf-2104d80bef0b","appliesTo":"CLASS"},"targets":[{"selector":".data-grid__item","originalId":"687bbc3b0bb3dd57d6c1fdc2|360ccfe7-4b62-2092-a8bf-2104d80bef0b","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159561602},"e-38":{"id":"e-38","name":"","animationType":"custom","eventTypeId":"SCROLL_OUT_OF_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-37"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".data-grid__item","originalId":"687bbc3b0bb3dd57d6c1fdc2|360ccfe7-4b62-2092-a8bf-2104d80bef0b","appliesTo":"CLASS"},"targets":[{"selector":".data-grid__item","originalId":"687bbc3b0bb3dd57d6c1fdc2|360ccfe7-4b62-2092-a8bf-2104d80bef0b","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1615159561604}},"actionLists":{"a-3":{"id":"a-3","title":"In-view","actionItemGroups":[{"actionItems":[{"id":"a-3-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":true,"id":"687bbc3b0bb3dd57d6c1fdc3|ef84c021-ebab-be06-65f8-7d4ac5740858"},"value":0,"unit":""}},{"id":"a-3-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":true,"id":"687bbc3b0bb3dd57d6c1fdc3|ef84c021-ebab-be06-65f8-7d4ac5740858"},"yValue":30,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"actionItems":[{"id":"a-3-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":1000,"target":{"useEventTarget":true,"id":"687bbc3b0bb3dd57d6c1fdc3|ef84c021-ebab-be06-65f8-7d4ac5740858"},"value":1,"unit":""}},{"id":"a-3-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeInOut","duration":1000,"target":{"useEventTarget":true,"id":"687bbc3b0bb3dd57d6c1fdc3|ef84c021-ebab-be06-65f8-7d4ac5740858"},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1615158676110},"a-4":{"id":"a-4","title":"Out-of-view","actionItemGroups":[{"actionItems":[{"id":"a-4-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":true,"id":"687bbc3b0bb3dd57d6c1fdc3|ef84c021-ebab-be06-65f8-7d4ac5740858"},"value":0,"unit":""}},{"id":"a-4-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeInOut","duration":500,"target":{"useEventTarget":true,"id":"687bbc3b0bb3dd57d6c1fdc3|ef84c021-ebab-be06-65f8-7d4ac5740858"},"yValue":30,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1615158676110}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Go({ as: _Component = _Builtin.Block }) {
  _interactions.useInteractions(_interactionsData);

  return (
    <_Component className="go" tag="section">
      <_Builtin.Block className="go_img" tag="div">
        <_Builtin.Block
          className="hero-flex__item hero-flex__item--bot"
          tag="div"
        >
          <_Builtin.Grid className="ludicrous-grid" tag="div">
            <_Builtin.Block className="data-grid__item" tag="div">
              <_Builtin.Block className="data__title" tag="div">
                {"1,020hp"}
              </_Builtin.Block>
              <_Builtin.Block className="data__sub-text" tag="div">
                {"Peak power"}
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block className="data-grid__item" tag="div">
              <_Builtin.Block className="data__title" tag="div">
                {"9.23s"}
              </_Builtin.Block>
              <_Builtin.Block className="data__sub-text" tag="div">
                {"@155 mph 1/4 mile"}
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block className="data-grid__item" tag="div">
              <_Builtin.Block className="data__title" tag="div">
                {"1.99s"}
              </_Builtin.Block>
              <_Builtin.Block className="data__sub-text" tag="div">
                {"0-60 mph*"}
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Grid>
        </_Builtin.Block>
      </_Builtin.Block>
      <_Builtin.Block className="go_text" tag="div">
        <_Builtin.Block
          className="hero-grid__subheading hero-grid__subheading--alight-left"
          tag="div"
        >
          {"Range"}
        </_Builtin.Block>
        <_Builtin.Heading className="ludicrous__heading" tag="h3">
          {"Go Anywhere"}
        </_Builtin.Heading>
        <_Builtin.Paragraph className="paragraph__animated">
          {
            "Travel farther on a single charge than any other electric vehicle—and keep going with access to 20,000+ Superchargers globally. By combining up to 412 miles of estimated range with Tesla fast charging technology, you’ll spend less time charging and even more time on the road."
          }
        </_Builtin.Paragraph>
        <_Builtin.Link
          className="button button--dark button--auto"
          button={false}
          block=""
          options={{
            href: "https://www.eikonlabs.com/",
            target: "_blank",
          }}
        >
          {"order now"}
        </_Builtin.Link>
      </_Builtin.Block>
    </_Component>
  );
}
