import { CIRCLE_ADDRESS, CIRCLES, type Circle } from "@/mock";
import useCircle from "./useCircle";

export default function useCircles() {
  const { circle, isLoading, error } = useCircle(CIRCLE_ADDRESS);
  if (error) return { data: CIRCLES, isLoading };
  const circles: Circle[] = [circle, ...CIRCLES];
  return { data: circles, isLoading };
}
