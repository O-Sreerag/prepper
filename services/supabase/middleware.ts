import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

interface Permission {
  actions: string[];
  link: string;
  module_name: string;
  module_parent: string;
}

interface MyTokenClaims {
  aal: string;
  amr: Array<{ method: string; timestamp: number }>;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  aud: string;
  email: string;
  exp: number;
  iat: number;
  is_anonymous: boolean;
  iss: string;
  permissions: Permission[];
  phone: string;
  role: string;
  role_ids: string[];
  session_id: string;
  sub: string;
  user_metadata: {
    email_verified: boolean;
  };
}

export const getFirstAccessibleRoute = (
  permissions: Permission[] | undefined
): string => {
  if (!permissions) {
    return "/";
  }
  const firstPermission = permissions.find((p) => p.actions.includes("VIEW") && p.link);
  if (firstPermission && firstPermission.link) {
    return firstPermission.link.trim().replace(/[\r\n]/g, '');
  }
  return "/";
};

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: any) {
            cookiesToSet.forEach(({ name, value }: any) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }: any) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    const publicRoutes = ["/login", "/new-password", "/forgot-password"];

    const isPublicRoute = publicRoutes.some((path) =>
      request.nextUrl.pathname.startsWith(path),
    );

    if(user?.user_metadata?.platform !== "HRMS" && !isPublicRoute){
        const { error } = await supabase.auth.signOut();
        if(error){}
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!user && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user && request.nextUrl.pathname.startsWith("/login")) {
      try {
        // Get the session to access the JWT token
        const sessionRes = await supabase.auth.getSession();
        const accessToken = sessionRes.data.session?.access_token;

        if (!accessToken) {
          console.error("No access token found");
          return NextResponse.redirect(new URL("/login", request.url));
        }

        // // Decode the JWT to get permissions
        // const decoded = jwtDecode(accessToken) as MyTokenClaims;
        // const redirectRoute = getFirstAccessibleRoute(decoded.permissions);
        
        return NextResponse.redirect(new URL("/", request.url));
      } catch (jwtError) {
        console.error("Error decoding JWT or processing permissions:", jwtError);
        // Fallback to dashboard if there's an error
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return response; 
  } catch (e: unknown) {
    console.error("Middleware error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};