"use client";

import { URL_INVALID } from "@/lib/logic/aiCapabilities/constants";
import handleUrlInputOnChange from "@/utils/handleUrlInputOnChange";
import { useState } from "react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Heading from "./ui/Heading";
import Text from "./ui/Text";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import VStack from "./ui/stack/VStack";
import FormGroup from "./ui/FormGroup";
import InputField from "./ui/Input";
import HStack from "./ui/stack/HStack";
import Button from "./ui/Button";

const PricingInputURL = ({
  inputName,
  onUrlChange,
  value,
  hidden,
  onUrlConfirmed,
}: {
  inputName: string;
  onUrlChange: (url: string) => void;
  value?: string;
  hidden: boolean;
  onUrlConfirmed: () => void;
}) => {
  return (
    <VStack align="end" space={2}>
      <FormGroup
        className={classNames({
          hidden,
        })}
        label="URL to a page with pricing information"
      >
        <InputField
          hidden={hidden}
          className="w-full"
          name={inputName}
          onChange={handleUrlInputOnChange(onUrlChange)}
          value={value}
          type="url"
          placeholder="https://example.com/pricing"
        />
      </FormGroup>
      <Button onClick={onUrlConfirmed} type="button">
        Save
      </Button>
    </VStack>
  );
};

const PricingDescriptionCard = ({
  description,
  heading = "We're looking for your pricing page:",
  pronoun = "your",
  inputName,
  onUrlChange,
  value,
  onUrlConfirmed,
}: {
  description?: string;
  heading?: string;
  pronoun?: "your" | "their";
  inputName: string;
  onUrlChange: (url: string) => void;
  value?: string;
  onUrlConfirmed?: () => void;
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const openInput = () => setInputVisible(true);

  const [urlConfirmed, setUrlConfirmed] = useState(false);
  const onConfirm = () => {
    setUrlConfirmed(true);
    onUrlConfirmed?.();
  };

  return (
    <Card>
      <CardHeader>
        <Heading level={1} displayAs={6}>
          {heading}
        </Heading>
      </CardHeader>
      <CardContent>
        {urlConfirmed ? (
          <VStack space={1}>
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
            <Heading level={6}>Got it!</Heading>
          </VStack>
        ) : description === undefined && !value ? (
          <VStack align="start">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </VStack>
        ) : description === URL_INVALID ? (
          <VStack align="start">
            <Text>
              We couldn&apos;t find {pronoun} pricing page. Do{" "}
              {pronoun === "their" ? "they" : "you"} have one?
            </Text>
            <HStack>
              <Button variant="outline" onClick={onConfirm} type="button">
                No, {pronoun === "their" ? "they" : "we"} don&apos;t have one.
              </Button>
              <Button onClick={openInput} type="button">
                Yes, let me enter one
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack align="start" space={8}>
            <VStack align="start" space={1}>
              <Text>We found a pricing page. Is this right?</Text>
              {!inputVisible && value && (
                <Button
                  variant="link"
                  href={value}
                  target="_blank"
                  iconRight={<ExternalLinkIcon />}
                  type="button"
                >
                  {value}
                </Button>
              )}
            </VStack>
            <HStack className={classNames({ hidden: inputVisible })}>
              <Button variant="outline" onClick={openInput} type="button">
                No, let me change it
              </Button>
              <Button onClick={onConfirm} type="button">
                Looks good!
              </Button>
            </HStack>
          </VStack>
        )}
      </CardContent>
      <CardFooter
        className={classNames({ hidden: !inputVisible || urlConfirmed })}
      >
        <PricingInputURL
          hidden={!inputVisible}
          inputName={inputName}
          onUrlChange={onUrlChange}
          value={value}
          onUrlConfirmed={onConfirm}
        />
      </CardFooter>
    </Card>
  );
};

export default PricingDescriptionCard;
