import React, { useEffect, useState } from 'react';
import {
    Badge,
    Button,
    ButtonGroup,
    Divider,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Switch,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { AnthropicIcon, OllamaIcon, OpenAIIcon } from "../../../assets/icons";
import { useSettingsStore } from "../../settings/SettingsStore";
import { API_URL } from '../../../utils/constants/constants';

const ModelSettingsModal = () => {
    const isOpen = useSettingsStore((state) => state.showModelSettingsModal);
    const setIsOpen = useSettingsStore((state) => state.setShowModelSettingsModal);
    const handleClose = () => setIsOpen(false);

    const {
        openAIKey,
        openAIBaseUrl,
        serverProxyUrl,
        modelType,
        ollamaUrl,
        ollamaModel,
		isLocal,
        setSettings,
        setModelType,
        fetchSettings,
    } = useSettingsStore.getState();

    const [show, setShow] = useState(false);
    const [tempOpenAIKey, setTempOpenAIKey] = useState("");
    const [tempServerUrl, setTempServerUrl] = useState("");
    const [tempOpenAIBaseUrl, setTempOpenAIBaseUrl] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [tempModelType, setTempModelType] = useState(modelType);
    const [tempOllamaUrl, setTempOllamaUrl] = useState("");
    const [tempOllamaModel, setTempOllamaModel] = useState("");
	const [tempAnthropicKey, setTempAnthropicKey] = useState("");
	const [tempAnthropicModel, setTempAnthropicModel] = useState("");
	const [tempAnthropicBaseUrl, setTempAnthropicBaseUrl] = useState("");
	const [tempIsLocal, setTempIsLocal] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    useEffect(() => {
        validate();
    }, [tempOpenAIKey, tempServerUrl, tempOpenAIBaseUrl, tempAnthropicKey, tempAnthropicModel, tempAnthropicBaseUrl, tempIsLocal]);

    useEffect(() => {
        setTempModelType(modelType);
    }, [modelType]);

    const loadSettings = () => {
        setTempOpenAIKey(openAIKey || "");
        setTempServerUrl(serverProxyUrl || API_URL);
        setTempOpenAIBaseUrl(openAIBaseUrl || "");
        setTempOllamaUrl(ollamaUrl || "");
        setTempOllamaModel(ollamaModel || "");
        setTempModelType(modelType || "openai");
		setTempIsLocal(isLocal || modelType === "ollama" || false);
    };

    const validate = () => {
        if ((tempOpenAIBaseUrl && !tempOpenAIKey) || (tempOpenAIBaseUrl && !tempAnthropicKey) || (tempOpenAIBaseUrl && !tempIsLocal) || (tempAnthropicBaseUrl && !tempIsLocal)){
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    };

    const saveSettings = async () => {
        if (!isValid) {
            toast({
                title: "Error",
                description: "Please check your settings and try again.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            return;
        }
		
        await setSettings({
            openAIBaseUrl: tempOpenAIBaseUrl,
            openAIKey: tempOpenAIKey,
            serverProxyUrl: !tempIsLocal ? tempServerUrl : "",
            ollamaUrl: tempOllamaUrl,
            ollamaModel: tempOllamaModel,
			isLocal: tempIsLocal || tempModelType === "ollama",
            modelType: tempModelType,
        });
        setModelType(tempModelType);
        handleClose();
    };

    const toggleShowKey = () => setShow(!show);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size={["sm", "md", "lg"]}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={6} fontFamily="Space Grotesk">
                        <ButtonGroup
                            colorScheme="orange"
                            width="100%"
                            isAttached
                            fontFamily="Space Grotesk"
                        >
                            <Button
                                width="33.33%"
                                variant={tempModelType === "openai" ? "solid" : "outline"}
                                leftIcon={<OpenAIIcon />}
                                onClick={() => setTempModelType("openai")}
                            >
                                OpenAI
                            </Button>
                            <Button
                                width="33.33%"
                                variant={tempModelType === "ollama" ? "solid" : "outline"}
                                leftIcon={<OllamaIcon />}
                                onClick={() => setTempModelType("ollama")}
                                rightIcon={
                                    <Badge
                                        fontSize="smaller"
                                        colorScheme="blue"
                                        _dark={{ background: "blue.100" }}
                                    >
                                        Beta
                                    </Badge>
                                }
                            >
                                Ollama
                            </Button>
							<Button
                                width="33.33%"
                                variant={tempModelType === "anthropic" ? "solid" : "outline"}
                                leftIcon={<AnthropicIcon />}
                                onClick={() => setTempModelType("anthropic")}
                                rightIcon={
                                    <Badge
                                        fontSize="smaller"
                                        colorScheme="blue"
                                        _dark={{ background: "blue.100" }}
                                    >
                                        Beta
                                    </Badge>
                                }
                            >
                                Anthropic
                            </Button>
                        </ButtonGroup>

                        {tempModelType === "openai" && (
                            <>
                                <FormControl
                                    id="api-key"
                                    isInvalid={Boolean(tempOpenAIBaseUrl && !tempOpenAIKey)}
                                >
                                    <FormLabel fontWeight="bold" fontSize="lg">
                                        OpenAI API Key
                                    </FormLabel>
                                    <InputGroup>
                                        <Input
                                            pr="4.5rem"
                                            type={show ? "text" : "password"}
                                            placeholder="Enter your OpenAI API Key"
                                            value={tempOpenAIKey}
                                            onChange={(e) => setTempOpenAIKey(e.target.value)}
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Button
                                                colorScheme="orange"
                                                h="1.75rem"
                                                size="sm"
                                                onClick={toggleShowKey}
                                            >
                                                {show ? "Hide" : "Show"}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    {!isValid && tempOpenAIBaseUrl && (
                                        <Text mt="2" fontSize="small" color="red.500">
                                            API key must be set if base URL or proxy server URL is provided.
                                        </Text>
                                    )}
                                    <Text mt="2" fontSize="small" color="gray.500">
                                        For unlimited usage of Thread&apos;s AI features, enter your OpenAI API key above.
                                    </Text>
                                </FormControl>
                                <FormControl id="base-openai-url">
                                    <FormLabel fontWeight="bold" fontSize="lg">
                                        OpenAI Base URL
                                    </FormLabel>
                                    <Input
                                        placeholder="Enter your OpenAI Base URL"
                                        value={tempOpenAIBaseUrl}
                                        onChange={(e) => setTempOpenAIBaseUrl(e.target.value)}
                                    />
                                    <Text mt="2" fontSize="small" color="gray.500">
                                        Optional: Enter the base URL for OpenAI.
                                    </Text>
                                </FormControl>
                            </>
                        )}

						{ tempModelType === "ollama" && (
                            <>
                                <FormControl id="ollama-url">
                                    <FormLabel fontWeight="bold" fontSize="lg">
                                        Ollama URL
                                    </FormLabel>
                                    <Input
                                        placeholder="Enter your Ollama URL"
                                        value={tempOllamaUrl}
                                        onChange={(e) => setTempOllamaUrl(e.target.value)}
                                    />
                                    <Text mt="2" fontSize="small" color="gray.500">
                                        The URL of your Ollama model, e.g. http://localhost:11434/v1. If localhost doesn&apos;t work, try 0.0.0.0
                                    </Text>
                                </FormControl>
                                <FormControl id="ollama-model">
                                    <FormLabel fontWeight="bold" fontSize="lg">
                                        Ollama Model Name
                                    </FormLabel>
                                    <Input
                                        placeholder="Enter your Ollama Model Name"
                                        value={tempOllamaModel}
                                        onChange={(e) => setTempOllamaModel(e.target.value)}
                                    />
                                    <Text mt="2" fontSize="small" color="gray.500">
                                        The name of the Ollama model being served, e.g. llama3 or codestral. For current purposes,{" "}
                                        <Text
                                            as={Link}
                                            href="https://ollama.com/library/codestral"
                                            target="_blank"
                                            cursor="pointer"
                                            color="blue.500"
                                        >
                                            codestral
                                        </Text>{" "}
                                        is recommended.
                                    </Text>
                                </FormControl>
                            </>
                        )}

						{ tempModelType === "anthropic" && (
                            <>
								<FormControl
									id="api-key"
									isInvalid={Boolean(tempAnthropicBaseUrl && !tempAnthropicKey)}
								>
									<FormLabel fontWeight="bold" fontSize="lg">
										Anthropic API Key
									</FormLabel>
									<InputGroup>
										<Input
											pr="4.5rem"
											type={show ? "text" : "password"}
											placeholder="Enter your Anthropic API Key"
											value={tempAnthropicKey}
											onChange={(e) => setTempAnthropicKey(e.target.value)}
										/>
										<InputRightElement width="4.5rem">
											<Button
												colorScheme="orange"
												h="1.75rem"
												size="sm"
												onClick={toggleShowKey}
											>
												{show ? "Hide" : "Show"}
											</Button>
										</InputRightElement>
									</InputGroup>
									{!isValid && tempAnthropicBaseUrl && (
										<Text mt="2" fontSize="small" color="red.500">
											API key must be set if base URL or proxy server URL is provided.
										</Text>
									)}
									<Text mt="2" fontSize="small" color="gray.500">
										For unlimited usage of Thread&apos;s AI features, enter your Anthropic API key above.
									</Text>
								</FormControl>
								<FormControl id="base-anthropic-url">
									<FormLabel fontWeight="bold" fontSize="lg">
										Anthropic Base URL
									</FormLabel>
									<Input
										placeholder="Enter your Anthropic Base URL"
										value={tempAnthropicBaseUrl}
										onChange={(e) => setTempAnthropicBaseUrl(e.target.value)}
									/>
									<Text mt="2" fontSize="small" color="gray.500">
										Optional: Enter the base URL for Anthropic.
									</Text>
								</FormControl>
							</>
                        )}

						{tempModelType !== "ollama" ? (
							<>
								<Divider></Divider>

								<FormControl display="flex" flexDirection="column" alignItems="start">
									<HStack width="100%" justifyContent="space-between" alignItems="center">
										<FormLabel htmlFor="is-local" mb="0" fontWeight="bold" fontSize="lg">
											Send API Calls Locally
										</FormLabel>
										<Switch
											id="is-local"
											colorScheme="orange"
											isChecked={tempIsLocal}
											onChange={(e) => setTempIsLocal(e.target.checked)}
										/>
									</HStack>
									{tempIsLocal && (
										<Text mt="2" fontSize="small" color="gray.500">
											Send requests directly from the client.
										</Text>
									)}
								</FormControl>

								{!tempIsLocal && (
									<FormControl id="proxy-url" mt="-4">
										<Input
											placeholder="Enter your Server Proxy URL"
											value={tempServerUrl}
											onChange={(e) => setTempServerUrl(e.target.value)}
										/>
										<Text mt="2" fontSize="small" color="gray.500">
											Enter the URL of your server proxy.
											For a local proxy, use http://localhost:5001
											or the appropriate port.
										</Text>
									</FormControl>
								)}
							</>
						) : (
							<>
								<Divider></Divider>

								<FormControl display="flex" flexDirection="column" alignItems="start">
									<HStack width="100%" justifyContent="space-between" alignItems="center">
										<FormLabel htmlFor="is-local" mb="0" fontWeight="bold" fontSize="lg">
											Send API Calls Locally
										</FormLabel>
										<Switch
											id="is-local"
											colorScheme="orange"
											isChecked={true}
											disabled={true}
										/>
									</HStack>
									<Text mt="2" fontSize="small" color="gray.500">
										Ollama only supports local API calls.
									</Text>
								</FormControl>
							</>
						)}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <HStack width="100%" justifyContent="flex-end">
                        <Button
                            variant="ghost"
                            colorScheme="red"
                            onClick={handleClose}
                            fontFamily="Space Grotesk"
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="orange"
                            onClick={saveSettings}
                            isDisabled={!isValid}
                            fontFamily="Space Grotesk"
                        >
                            Save
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModelSettingsModal;