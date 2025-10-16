// Router service for client-side navigation
class RouterService {
  private router: any = null;

  setRouter(router: any) {
    this.router = router;
  }

  push(path: string) {
    if (this.router) {
      this.router.push(path);
    } else {
      // Fallback to window.location if router is not available
      window.location.href = path;
    }
  }

  replace(path: string) {
    if (this.router) {
      this.router.replace(path);
    } else {
      // Fallback to window.location if router is not available
      window.location.href = path;
    }
  }
}

export const routerService = new RouterService();
