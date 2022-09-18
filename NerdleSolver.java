package test;

import java.util.*;
import java.io.*;

import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.ScriptException;

public class NerdleSolver {

	static String purgeLeadingZeros(String s) {
		String output = s;
		if (output.equals("0"))
			return output;
		while (output.charAt(0) == '0' && !"+-*/".contains("" + output.charAt(1))) {
			output = output.substring(1, output.length());
		}

		for (int i = 1; i < output.length() - 1; i++) {
			if (output.charAt(i) == '0') {
				if ("+-*/".contains("" + output.charAt(i - 1))) {
					if (i == output.length() - 1) {
						return output.substring(0, output.length() - 1);
					}

					output = output.substring(0, i) + output.substring(i + 1, output.length());

					i--;

				}
			}
		}
		return output;
	}

	static boolean equationSolver(String s) {
		String equation = "";
		String answer = "";
		int answerNum = 0;
		int engineNum = 0;
		for (int i = 0; i < s.length(); i++) {
			if (s.charAt(i) == '=') {
				equation = s.substring(0, i);
				answer = s.substring(i + 1, s.length());
			}
		}
		try {
			answerNum = Integer.parseInt(answer);

		} catch (NumberFormatException e) {
			// System.out.println ("www");
			return false;
		}
		ScriptEngineManager mgr = new ScriptEngineManager();
		ScriptEngine engine = mgr.getEngineByName("JavaScript");
		try {
			try {
				engineNum = Integer.parseInt("" + engine.eval(equation));
			} catch (NumberFormatException e) {
				// System.out.println ("wjero");
				return false;
			}
			if (answerNum == engineNum) {
				if (answer.equals(purgeLeadingZeros(answer)) && equation.equals(purgeLeadingZeros(equation))) {
					return true;
				} else
					return false;
			} else {
				// System.out.println ("weee");
				return false;
			}
		} catch (ScriptException e) {
			// System.out.println ("ttt");
			return false;
		}
	}

	static String removeChar(char c, String s) {
		if (s.length() == 1)
			return s;

		// System.out.println(s);
		// System.out.println (c);
		for (int i = 0; i < s.length(); i++) {
			if (s.charAt(i) == c) {
				// System.out.println(i);

				if (i == s.length() - 1) {
					return s.substring(0, s.length() - 1);
				}
				return (s.substring(0, i) + s.substring(i + 1, s.length()));
			}
		}
		return s;
	}

	static boolean isInteger(char c) {
		if ("1234567890".contains("" + c)) {
			return true;
		}
		return false;
	}

	static String[] removeOptions(String guess, String results, String[] options) {
		String[] newOptions = options;

		for (int i = 0; i < results.length(); i++) {

			switch (results.charAt(i)) {
			case '0':
				newOptions[i] = removeChar(guess.charAt(i), options[i]);
				for (int j = 0; j < 8; j++) {
					if (j != i && !newOptions[8].contains("" + guess.charAt(i))) {
						newOptions[j] = removeChar(guess.charAt(i), options[j]);
					}

				}

				break;
			case '1':

				newOptions[i] = removeChar(guess.charAt(i), options[i]);
				if (!newOptions[8].contains("" + guess.charAt(i))) {
					newOptions[8] += guess.charAt(i);
				}
				break;
			case '2':

				newOptions[i] = Character.toString(guess.charAt(i));
				if (!newOptions[8].contains("" + guess.charAt(i))) {
					newOptions[8] += guess.charAt(i);
				}
				break;
			}
		}
		return newOptions;
	}

	static String calculatePossibility(String[] possibilities) {
		boolean containsAll = false;
		for (int i0 = 0; i0 < possibilities[0].length(); i0++) {
			for (int i1 = 0; i1 < possibilities[1].length(); i1++) {
				for (int i2 = 0; i2 < possibilities[2].length(); i2++) {
					if ("+-*/=".contains("" + possibilities[2].charAt(i2))) {
						if ("+-*/=".contains("" + possibilities[1].charAt(i1))) {
							break;
						}
					}

					for (int i3 = 0; i3 < possibilities[3].length(); i3++) {
						if ("+-*/=".contains("" + possibilities[3].charAt(i3))) {
							if ("+-*/=".contains("" + possibilities[2].charAt(i2))) {
								break;
							}
						}
						

						for (int i4 = 0; i4 < possibilities[4].length(); i4++) {
							if (isInteger(possibilities[1].charAt(i1))&& isInteger(possibilities[2].charAt(i2)) && isInteger(possibilities[3].charAt(i3))) {
								
								break;
							}
							// it didn't start with a four digit
							if ("+-*/=".contains("" + possibilities[4].charAt(i4))) {
								if ("+-*/=".contains("" + possibilities[3].charAt(i3))) {
									break;
								}
							}

							for (int i5 = 0; i5 < possibilities[5].length(); i5++) {
								if ("+-*/=".contains("" + possibilities[5].charAt(i5))) {
									if ("+-*/=".contains("" + possibilities[4].charAt(i4))) {
										break;
									}
								}
								for (int i6 = 0; i6 < possibilities[6].length(); i6++) {
									if ("+-*/=".contains("" + possibilities[6].charAt(i6))) {
										if ("+-*/=".contains("" + possibilities[5].charAt(i5))) {
											break;
										}
									}
									for (int i7 = 0; i7 < possibilities[7].length(); i7++) {

										String test = "" + possibilities[0].charAt(i0) + possibilities[1].charAt(i1)
												+ possibilities[2].charAt(i2) + possibilities[3].charAt(i3)
												+ possibilities[4].charAt(i4) + possibilities[5].charAt(i5)
												+ possibilities[6].charAt(i6) + possibilities[7].charAt(i7);
										containsAll = true;
										System.out.println(test);
										
										for (int i = 0; i < possibilities[8].length(); i++) {
											if (!test.contains("" + possibilities[8].charAt(i))) {
												containsAll = false;
											}
										}
										if (containsAll && equationSolver(test)
												&& equationSolver(purgeLeadingZeros(test))) {

											return test;
										}
									}
								}
							}
						}

					}

				}
			}
		}
		return ("Something went wrong");
	}

	public static void main(String[] args) {

		Scanner sc = new Scanner(System.in);
		String[] possibilities = new String[9]; // first 8 strings are the possibilities for each space, 9th string is
												// the known characters
		while (true) {
			possibilities[0] = "123456789";
			possibilities[7] = "1234567890";
			

			for (int i = 1; i <= 6; i++) {
				possibilities[i] = "1234567890+-*/=";
			}
		
			possibilities[8] = ""; // no known characters at the start
			
			while (true) {
				System.out.println("Enter your guess (0 to restart, -1 to quit)");
				String guess = sc.next();
				if (guess.equals("-1"))
					return;
				if (guess.equals("0"))
					break;
				System.out.println("\nEnter your clues:");
				String result = sc.next();

				possibilities = removeOptions(guess, result, possibilities);
				/*for (int i = 0; i < 9; i++) {
					System.out.println(possibilities[i]);
				}*/
				System.out.println("Enter f to find a possible guess, enter next to input another guess");
				if (sc.next().equals("f")) {
					System.out.println("Possible Guess: " + calculatePossibility(possibilities));
				}
			}
		}
		// test code
		// System.out.println (removeChar('1',"123456"));

		/*
		 * for (int i = 0; i < 9; i++) { System.out.println(possibilities[i]); } /*
		 * possibilities = removeOptions("4+6*4=28", "12120220", possibilities);
		 * 
		 * System.out.println(equationSolver("2+4*6=26"));
		 * 
		 * System.out.println("ANSWER" + calculatePossibility(possibilities));
		 */

		// System.out.println(equationSolver ("48**==34"));
		/*
		 * ScriptEngineManager mgr = new ScriptEngineManager(); ScriptEngine engine =
		 * mgr.getEngineByName("JavaScript"); try { System.out.println("" +
		 * engine.eval("28-030")); } catch (ScriptException e) {
		 * 
		 * }
		 */
		// System.out.println(purgeLeadingZeros("28-030+04-25*41/044"));
		// sc.next();
	}

}
