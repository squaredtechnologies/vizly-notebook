import React, { useEffect } from "react";

function useContentHeight(ref: React.RefObject<HTMLElement>, states?: any[]) {
	const getMaxScrollHeight = (element: HTMLElement): number => {
		let maxScrollHeight = element.scrollHeight;

		Array.from(element.children).forEach((child) => {
			maxScrollHeight = Math.max(
				maxScrollHeight,
				getMaxScrollHeight(child as HTMLElement),
			);
		});

		return maxScrollHeight;
	};

	useEffect(() => {
		if (ref.current) {
			const contentHeight = getMaxScrollHeight(ref.current);

			// Set the minHeight to fit the contents (add some padding if needed)
			ref.current.style.minHeight = `${contentHeight}px`;
		}
	}, [ref, ref.current, ref.current?.children]);
}

export default useContentHeight;
