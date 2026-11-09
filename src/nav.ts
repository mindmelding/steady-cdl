// Navigation helpers. Going "home" must pop back to the existing tab screen: router.replace('/learn')
// from a lesson/test screen would stack a second copy of the tabs under the first.
interface HomeRouter {
  replace: (href: string) => void;
  dismissTo?: (href: string) => void;
}

export function goHome(router: HomeRouter): void {
  if (router.dismissTo) router.dismissTo('/learn');
  else router.replace('/learn');
}
