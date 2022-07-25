import React from "react";
import { Spinner } from "react-bootstrap";

import styles from "./LoadingOverlay.module.scss";

interface ILoadingOverlayProps {
	isLoading: boolean;
}

export default function LoadingOverlay(props: ILoadingOverlayProps) {
	const [isLoadingTransitionComplete, setIsLoadingTransitionComplete] = React.useState(true);

    /**
     * Allow for an intermediate state where we know the loading has ended but we can still
     * gracefully animate the transition to make the loading overlay disappear.
     */
	React.useEffect(() => {
		if (props.isLoading) {
			setIsLoadingTransitionComplete(false);
		}

		return setIsLoadingTransitionComplete(false);
	}, [props.isLoading]);

	const handleLoadingTransitionEnd = () => {
		setIsLoadingTransitionComplete(true);
	};

	const loadingClass = props.isLoading
		? styles.isLoading
		    : !props.isLoading && !isLoadingTransitionComplete
		        ? styles.isLoadedAndFadingOut
		            : styles.isLoaded;

	return (
		<div
			className={`${styles.loadingOverlay} ${loadingClass}`}
			onAnimationEnd={handleLoadingTransitionEnd}
			onTransitionEnd={handleLoadingTransitionEnd}
		>
			<div className={styles.loadingContainer}>
				<Spinner
					animation="border"
					variant="secondary"
					role="status"
					className={styles.loadingContainerSpinner}
				>
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		</div>
	);
}