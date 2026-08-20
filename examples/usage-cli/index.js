// Run 'make test' in this directory to execute the CLI integration tests.
// This file is kept as a reference for the expected CLI outputs shown in the Makefile.
//
// CODEOWNERS used in tests:
//   /shared  @shared-team
//   /lib     @lib-team
//   *.txt    @text-team
//
// Expected results:
//   owners /shared/test.txt,/lib/package.txt  →  @lib-team, @shared-team, @text-team
//   owners /mytest.txt                        →  @text-team
//   owners /shared/nothing.dat               →  @shared-team
//   owners /mytest.dat                       →  (empty)
//   owners /inexistent.txt                   →  @text-team
