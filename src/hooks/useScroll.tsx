import { useEffect, useState, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";

export function useScrollToBottom(
	ref: React.RefObject<HTMLElement>,
	threshold: number = 1,
	watchState?: any,
	gateCondition?: any,
) {
	const [userHasScrolled, setUserHasScrolled] = useState(false);

	const debouncedScrollToBottom = useMemo(
		() =>
			debounce(() => {
				if (
					ref.current &&
					(gateCondition == undefined || gateCondition) &&
					!userHasScrolled
				) {
					const bottomPosition = ref.current.scrollHeight;

					ref.current.scrollTo({
						top: bottomPosition,
						behavior: "smooth",
					});
				}
			}, 250),
		[ref, gateCondition, userHasScrolled],
	);

	const scrollToBottom = useCallback(() => {
		debouncedScrollToBottom();
	}, [debouncedScrollToBottom]);

	const handleScroll = useCallback(() => {
		if (ref.current) {
			const isScrolledToBottom =
				ref.current.scrollHeight - ref.current.clientHeight <=
				ref.current.scrollTop + threshold;

			setUserHasScrolled(!isScrolledToBottom);
			debouncedScrollToBottom.cancel(); // cancel the debounce when user scrolls
		}
	}, [ref, watchState, debouncedScrollToBottom]);

	useEffect(() => {
		if (!userHasScrolled) {
			scrollToBottom();
		}
	}, [ref, userHasScrolled, watchState]);

	// Separate useEffect for adding and removing scroll event listener
	useEffect(() => {
		const element = ref.current;
		if (element) {
			element.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (element) {
				element.removeEventListener("scroll", handleScroll);
			}
		};
	}, [ref, handleScroll]);

	return { scrollToBottom, handleScroll, setUserHasScrolled };
}

export function useScrollToRef(ref: React.RefObject<HTMLElement>) {
	const [userHasScrolled, setUserHasScrolled] = useState(false);

	const scrollToSelected = () => {
		if (ref.current) {
			ref.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "start",
			});
		}
	};

	const handleScroll = () => {
		if (ref.current) {
			const isScrolledToSelected =
				ref.current.scrollHeight - ref.current.clientHeight <=
				ref.current.scrollTop + 1;
			setUserHasScrolled(!isScrolledToSelected);
		}
	};

	useEffect(() => {
		if (!userHasScrolled) {
			scrollToSelected();
		}
		const element = ref.current;
		if (element) {
			element.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (element) {
				element.removeEventListener("scroll", handleScroll);
			}
		};
	}, [ref, userHasScrolled]);

	return { scrollToSelected, handleScroll };
}
