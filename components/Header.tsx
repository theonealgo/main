// components/Header.tsx
 'use client';

 import Link from 'next/link';
 import Image from 'next/image';
+import { useSession } from 'next-auth/react';

 // ... your menus array

 export default function Header() {
+  const { data: session } = useSession();

   return (
     <header className="w-full bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
       {/* Logo */}
       <Link href="/" className="flex items-center">
         <Image
           src="/images/theonelogo.png"
           alt="Logo"
           width={128}
           height={128}
           className="h-10 w-auto"
         />
       </Link>

       {/* Navigation */}
       <nav className="flex items-center gap-6">
         {menus.map(({ key, label, items }) => (
           <div key={key} className="relative group">
             <button className="hover:text-teal-400 transition">{label}</button>
             <div
               className="
                 absolute left-0 top-full w-40 bg-gray-900 rounded shadow-lg py-2 z-50
                 opacity-0 invisible group-hover:visible group-hover:opacity-100
                 transition-opacity
               "
             >
               {items.map(({ href, label }) => (
                 <Link
                   key={href}
                   href={href}
                   className="block px-4 py-2 hover:bg-gray-800"
                 >
                   {label}
                 </Link>
               ))}
             </div>
           </div>
         ))}

-        {/* Get Started CTA */}
-        <Link
-          href="/auth?screen_hint=signup"
-          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
-        >
-          Get Started
-        </Link>
+        {/* CTA: if logged in, show name; otherwise Get Started */}
+        {session?.user ? (
+          <Link
+            href="/dashboard"
+            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
+          >
+            {session.user.name ?? session.user.email}
+          </Link>
+        ) : (
+          <Link
+            href="/auth?screen_hint=signup"
+            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
+          >
+            Get Started
+          </Link>
+        )}
       </nav>
     </header>
   );
 }
